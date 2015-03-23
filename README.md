[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

#BeerSmith Tap List
Node.js script to list what's on tap, along with info about that beer, from a specified field entry in the BeerSmith 2 Recipe definition.  

This is a bit of a hack - BeerSmith was never intended to indicate what's on tap and what's not. I never use the "Assistant brewer" field however, so I've cannibalised it for my needs, assigning meaning to certain strings in this field as I put beer into a fermentor & brew ("On Deck"), and rotate finished beer in kegs into the tap fridge ("On Tap").  
You can override the field used if you like, but I find the default "Assistant brewer" works well for me - just remember to always fill the field the same way. This is case sensitive - so never fill one as "On Tap", and another as "on tap".

## Finding your BeerSmith Recipe definition file
BeerSmith 2 stores it's recipes in a user specified location. By default this was `~/Documents/Beersmith2`, but I moved it to `~/Dropbox/BeerSmith` using the File -> Change Documents Directory function in BeerSmith. I then copied a public share URL of my file in DropBox. 

## Usage

### As a standlone webserver
    
    export BS_FILE_PATH="path to your recipes.bsmx file"
    npm start
    
Or, use the deploy to heroku button above    


### Init with an options object

var bs = require('beersmithtaplist');
bs({
  path : '' // String - Required. Specifies the location of Recipe.bsmx file. File path or HTTP URL (performs a web request). 
  bs_field : 'ASST_BREWER', // String - Optional, the field from which to pull the tap status of the beer. Defaults to 'ASST_BREWER', the assistant brewer field.
  cacheTimeout : 86400000 // Integer - Optional - only used for recipe file definitions which are loaded over HTTP. default is 1 day
  }, function(err, res){
    // res is JSON object with properties as you defined them on the 'BS_FIELD' setting. Also returns 'recipes' - a list of anything with an empty 'BS_FIELD' value.
    });
    
    ### Init with Environment Variables
    
    # As above, but requires the following environment variables
    export BS_FILE_PATH # required
    export BS_FIELD # optional
    export BS_CACHE_TIMEOUT # optional
