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
const HapiWebSocket = require('hapi-plugin-websocket');
const server = new Hapi.Server();

var ws_server;

server.connection({ port: config.HTTP_PORT });
server.register(HapiWebSocket, () => {
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
        },
    });
    server.route({
        method: "POST",
        path: "/stream",
        config: {
            plugins: {
                websocket: {
                    only: true,
                    connect: (wss, ws) => {
                        ws_server = wss;
                    },
                    disconnect: (wss, ws) => {
                    }
                }
            }
        },
        handler: (request, reply) => {},
    });
    server.start( err => {
        if (err) {
            throw err;
        }
        console.log(`REST server running at ${server.info.uri}`);
    });
});

function broadcast(wss, data) {
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
    if (ws_server && traffic.length) {
        console.log(`Relayed ${traffic.length} traffic events`);
        broadcast( ws_server, JSON.stringify( traffic.splice(0) ) );
    }
}

setInterval( push_traffic, config.WS_INTERVAL );
