var http = require('http');
http.createServer(function (req, res) {
    if(req.method === "POST") {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"message": "Hello POST!"}));
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"message": "Hello World"}));
    }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');