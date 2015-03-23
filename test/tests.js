var bs = require('../index.js'),
assert = require('assert'),
path = './test/fixtures/Recipe.bsmx';

bs({
  path : path
}, function(err, res){
  assert.ok(!err);
  assert.ok(res.ontap);
  var aRes = res.ontap[0];
  assert.ok(aRes.name);
  assert.ok(res.recipes);
  
});

bs({}, function(err, res){
  assert.ok(err, 'Throws when no path specd');
});

process.env.BS_FILE_PATH = path;
// Works with no-otions and takes path from env var
bs(function(err, res){
  assert.ok(!err, err);
  assert.ok(res);
});
