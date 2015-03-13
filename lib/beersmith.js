var fs = require('fs'),
path = require('path'),
parser = require('xml2json'),
request = require('request'),
cache = require('memory-cache'),
_ = require('underscore'),
Entities = require('html-entities').AllHtmlEntities,
entities = new Entities();

module.exports = function(options, cb){
  if (typeof cb === 'undefined'){
    cb = options;
    options = {};
  }
  
  var FIELD = options.bs_field || process.env.BS_FIELD || 'ASST_BREWER',
  ONTAP = options.bs_ontap || process.env.BS_ONTAP || 'ontap',
  ONDECK = options.bs_ondeck || process.env.BS_ONDECK || 'ondeck';
  options.cacheTimeout = options.cacheTimeout || process.env.BS_CACHE_TIMEOUT || 86400000; // 1 day
  options.cacheTimeout = parseInt(options.cacheTimeout);
  retrieveBeersmithFile(options, function(err, file){
    if (err){
      return cb(err);
    }
    file = file.replace(/&[a-zA-Z]+;/g, ''); // TODO Be nice to encode these properly
    if (err){
      return cb(err);
    }
    var json;
    try{
      json = parser.toJson(file, { object : true, reversible: false });  
    }catch(err){
      return cb(err);
    }
    var recipes = json && json.Recipe && json.Recipe.Data && json.Recipe.Data.Recipe,
    fieldWithPrefix = _fieldWithPrefix(recipes),
    query = {},
    onTap, onDeck;
    
    // Get the beers on tap
    query[fieldWithPrefix] = ONTAP;
    onTap = _.where(recipes, query);
    
    // Get the beers on deck
    query[fieldWithPrefix] = ONDECK;
    onDeck = _.where(recipes, query);
    
    return cb(null, { ontap : _normalise(onTap), ondeck : _normalise(onDeck), recipes : _normalise(recipes) });
  });
  
  /*
  Every field in my xml def has a prefix F_E_ - I have no idea what this is. 
  Code around it by finding the correct FIELD regardless of this odd prefix quirk
  */
  function _fieldWithPrefix(recipes){
    var aRecipe = _.first(recipes);
    if (!aRecipe){
      return cb('No recipes found');
    }
    return _.first(_.filter(_.keys(aRecipe), function(key){
      return key.indexOf(FIELD) > -1;
    }));
  }
  
  /*
   Attempts to strip the prefix and print out a more JSON friendly representation of the recipe
   */
  function _normalise(recipes){
    if (_.isEmpty(recipes)){
      return [];
    }
    if (!_.isArray(recipes)){
      recipes = [recipes];
    }
    return _.map(recipes, function(r){
      return _normaliseSingle(r);
    });
  }
  function _normaliseSingle(r){
    var newObj = {};
    if (_.isEmpty(r)){
      return newObj;
    }
    
    _.each(r, function(value, key){
      key = key.toString().toLowerCase();
      // Replace prefix string - many have f_g_, f_h_, ...
      key = key.replace(/^f_[a-z]_/, '');
      if (typeof value === 'string'){
          // Double pass thru the entity decoder, some are nested
          value = entities.decode(value);
          value = entities.decode(value);
      }
      
      newObj[key] = value;
    });
    if (r.Ingredients && r.Ingredients.Data){
      newObj.grain = _normalise(r.Ingredients.Data.Grain);
      newObj.hops = _normalise(r.Ingredients.Data.Hops);
      newObj.water = _normaliseSingle(r.Ingredients.Data.Water);
      newObj.yeast = _normaliseSingle(r.Ingredients.Data.Yeast);
      newObj.misc = _normalise(r.Ingredients.Data.Misc);
    }
    return newObj;
  }
  
};

function retrieveBeersmithFile(options, cb){
  var path = options.path || process.env.BS_FILE_PATH;
  var cachedFile = cache.get(path);
  if (cachedFile){
    return cb(null, cachedFile);
  }
  if (!path){
    return cb('No file path specified');
  }
  if (path.indexOf('http')>-1){
    request(path, function(err, response, body){
      if (err || response.statusCode !== 200){
        return cb(err || 'Non-200 status code');
      }
      cache.put(path, body, options.cacheTimeout);
      return cb(null, body);
    });
  }else{
    fs.readFile(path, function(err, file){  
      if (err){
        return cb(err);
      }
      return cb(null, file.toString());
    });
  }
}
