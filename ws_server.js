#!/usr/bin/env node
var WebSocketServer = require('websocket').server;

var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

var clients=[];

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}


wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }



    var connection = request.accept('echo-protocol', request.origin);
    clients.push(connection);
    var checkboxStatus = 0;
    console.log((new Date()) + ' Connection accepted from ' + request.origin);
    connection.on('message', function(message) {

        if (message.type === 'utf8') {  
            console.log('Received Message: ' + message.utf8Data);

                if (message.utf8Data == 1) {
                    checkboxStatus = 1;
                } else if (message.utf8Data == 0) {
                    checkboxStatus = 0;
                }
        
                
                for (var i=0; i<clients.length; i++) {
                    clients[i].send(checkboxStatus);
                }

        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});