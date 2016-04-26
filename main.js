'use strict';

const config = require('./config');
require("console-stamp")(console);

var traffic = [];

////////////////////////////////////////////////////////////////////////
//                                                                    //
//                        Set up REST service                         //
//                                                                    //
////////////////////////////////////////////////////////////////////////

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({ port: config.HTTP_PORT });
server.route({
    method: 'GET',
    path: '/pending',
    handler: (request, reply) => {
        reply(traffic);
    },
});
server.route({
    method: 'POST',
    path: '/record',
    handler: (request, reply) => {
        traffic.push(request.payload);
        reply(`recorded ${request.payload}`);
        // console.log(`recorded ${request.payload}`);
    },
});
server.start( err => {
    if (err) {
        throw err;
    }
    console.log(`REST server running at ${server.info.uri}`);
});

////////////////////////////////////////////////////////////////////////
//                                                                    //
//                      Set up WebSocket service                      //
//                                                                    //
////////////////////////////////////////////////////////////////////////

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: config.WS_PORT });

console.log(`WebSocket server running at ws://localhost:${config.WS_PORT}`);

wss.on('connection', function connection(ws) {
    console.log('client connected');
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        try {
            client.send(data);
        } catch (e) {
            console.error('tried to send websocket message to closed client; ignoring.');
        }
    });
};

function push_traffic() {
    // broadcast traffic to websocket clients and empty the traffic list
    if (traffic.length) {
        console.log(`sending ${traffic.length} traffic events`);
        wss.broadcast( JSON.stringify( traffic.splice(0) ) );
    }
}

setInterval( push_traffic, config.WS_INTERVAL );
