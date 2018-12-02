const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');

//---------------- create servers

const server = {};

server.httpServer = http.createServer(function(req,res) {
    server.unifiedServer(req, res);  
});

server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res) {
    server.unifiedServer(req, res);  
});

//---------------- server handling
server.unifiedServer = function(req, res) {

    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    const method = req.method.toLowerCase();

    const queryStringObject =  parsedUrl.query;

    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');

    let buffer = '';

    req.on('data', data => {
        buffer += decoder.write(data)
    });

    req.on('end', () => {
 
        const chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        
        const data = {
            'trimmedPath': trimmedPath,
            'method': method,
            'queryStringObject': queryStringObject,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        chosenHandler(data, (statusCode, payload) => {

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/JSON')
            res.writeHead(statusCode);
            res.end(payloadString);

        });
    });
};
//---------------- start servers

server.init = () => {

    server.httpsServer.listen(config.httpsPort, function() {
        console.log(`server is listening on port ${config.httpsPort}`);
    });
    
    server.httpServer.listen(config.httpPort, function() {
        console.log(`server is listening on port ${config.httpPort}`);
    });
    
}

//---------------- routes handle
server.router = { 
    'users': handlers.users,
    'tokens': handlers.tokens,
    'menu': handlers.menu,
    'cart': handlers.cart,
    'orders': handlers.orders
};

module.exports = server;