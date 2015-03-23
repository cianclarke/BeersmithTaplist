var http = require('http');
var fs = require('fs');
var bs = require('../lib/beersmith.js');

http.createServer(function (req, res) {
  var headers = cors(req, res);
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    return res.end();
  }
  
  bs({path : process.env.BS_FILE_PATH }, function(err, bsRes){
    headers['Content-Type'] = 'application/json';
    if (err){
      res.writeHead(500, headers);
      return res.end(JSON.stringify(err));
    }
    res.writeHead(200, headers);
    res.end(JSON.stringify(bsRes));
  });
}).listen(process.env.PORT || 8000);

function cors(req, res){
  var headers = {};
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
  headers["Access-Control-Allow-Credentials"] = true;
  headers["Access-Control-Max-Age"] = '86400'; // 24 hours
  headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
  return headers;
}
