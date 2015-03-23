var http = require('http');
var fs = require('fs');
var bs = require('../lib/beersmith.js');

http.createServer(function (req, res) {
  bs({path : process.env.BS_FILE_PATH }, function(err, bsRes){
    if (err){
      res.writeHead(500, {'Content-Type' : 'application/json'});
      return res.end(JSON.stringify(err));
    }
    res.writeHead(200, {'Content-Type': 'application/json'});  
    res.end(JSON.stringify(bsRes));
  });
}).listen(process.env.PORT | 8000);
