[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

#BeerSmith Tap List
Node.js script to list what's on tap, along with info about that beer, from a specified field entry in the BeerSmith 2 Recipe definition.  

This is a bit of a hack - BeerSmith was never intended to indicate what's on tap and what's not. I never use the "Assistant brewer" field however, so I've cannibalised it for my needs, assigning meaning to certain strings in this field as I put beer into a fermentor & brew ("On Deck"), and rotate finished beer in kegs into the tap fridge ("On Tap").  
You can override the field used if you like, but I find the default "Assistant brewer" works well for me - just remember to always fill the field the same way. This is case sensitive - so never fill one as "On Tap", and another as "on tap".

## Finding your BeerSmith Recipe definition file
BeerSmith 2 stores it's recipes in a user specified location. By default this was `~/Documents/Beersmith2`, but I moved it to `~/Dropbox/BeerSmith` using the File -> Change Documents Directory function in BeerSmith. I then copied a public share URL of my file in DropBox. 

## Usage - Easy Mode: Including BeerSmith Taplist on your web site

Make sure you've got the public URL of your BeerSmith recipe file (from Dropbox or elsewhere) by following the above step - we'll need it.

### Deploy to Heroku
You'll need a Heroku account to do this. Click the Deploy button at the top of this repository. Once logged in, Heroku will ask you to fill in a text box in the ENV section. It'll look something like this:  
![env screen](http://i.imgur.com/E9V9Vjy.png)  
In this box, fill in the public URL of your recipe file from the above step. 
The name of your application doesn't matter - now click the Deploy button. This step might take a few minutes.  
![Done](http://i.imgur.com/Yr7cDjH.png)
Once completed, click the "View it" link. You should see a page full of funnily formatted text starting with `{` - this is your tap listing formatted as JSON data, and means everything worked OK. Take the URL of this page, and make a note of it. 

### Inlcude this code snippet on your website
Now, copy and paste the below code snippet into your website where you want the tap listing to appear. Be sure to replace PUT_YOUR_APP_URL_HERE with the URL of your heroku app from the previous "Deploy to Heroku" step. 

    <div id="beersmithtaplist"></div>
    <script>
      var beersmith_app_url = "PUT_YOUR_APP_URL_HERE";
      // Don't edit below here
      (function(){
        var bstlscript = document.createElement('script'); bstlscript.type = 'text/javascript'; bstlscript.async = true;
        bstlscript.src = 'https://cdn.rawgit.com/cianclarke/BeersmithTaplist/master/static/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(bstlscript);
      })()
    </script>
    
You can now style the tap listing using CSS to your hearts content!

## Usage - Hard Mode (for Node.js developers)

### As standalone microservice

### Include library with an options object

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
