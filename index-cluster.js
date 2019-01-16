/*
*
* simple Cluster class using
*
*/
//
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const cluster = require('cluster');
const cpusNum = require('os').cpus().length;
// define a port number
const port = '3030';
// create a server
const httpServer = http.createServer(function(req,res) {

    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    const method = req.method.toLowerCase();

    const queryStringObject =  parsedUrl.query;

    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');

    let buffer = '';
// data event
    req.on('data', function(data) {
        buffer += decoder.write(data)
    });
// end event
    req.on('end', function() {
// define req data
        const data = {
            'trimmedPath': trimmedPath,
            'method': method,
            'queryStringObject': queryStringObject,
            'headers': headers,
            'payload': buffer
        };
//choose a handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
// use a handler
        chosenHandler(data,function(statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {'message': 'Try again!'};
// make JSON            
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/JSON')
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('response is', statusCode, payloadString);
        });
    });  
});

// define handler object
const handlers = {};
//
handlers.hello  = function(data, callback) {
    callback(200, {'message': 'Welcome user! What can I do for you?'});
};
//
handlers.notFound = function(data, callback) {
    callback(404);
};
// define a router
const router = {
    'hello': handlers.hello
};
//
//
//
// multi core cluster system processing

if (cluster.isMaster) {
    console.log(`Master process is running`);
  
    // Fork workers
    for (let i = 0; i < cpusNum; i++) {
      cluster.fork();
    }

} else {
    //
    // start server listening
    httpServer.listen(port, function() {
        console.log(`HTTP server is listening on port ${port}...`);
    });
  
}
// end