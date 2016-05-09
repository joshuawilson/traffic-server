
var ids = ['0-1', '3-1', '3-2'];

const INTERNET_ID = 0;
const ENTRY_POINT_ID = 1;
const PUBLIC_PERCENTAGE = 0.2; // percentage of fake traffic that comes from public internet

const config = require('./config');
var http = require('http');
require("console-stamp")(console);

function start_spam() {
    var payload = JSON.stringify(random_traffic());
    var post = http.request({
        host: 'localhost',
        // host: 'traffic-server-demo.apps.demo.aws.paas.ninja',
        port: config.HTTP_PORT,
        path: '/record',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        },
    }, function(res) {
        res.setEncoding('utf8');
    });
    post.write(payload);
    post.end();
    console.log(`POST ${payload}`);
}

function random_traffic() {
    return random_microservice_traffic();
}

function random_microservice_traffic() {
    // ids.sort(shuffler);
    var id = Math.floor(Math.random() * (ids.length - 1));
    return traffic( ids[id], ids[id+1] );
}

function public_traffic() {
    return traffic( INTERNET_ID, ENTRY_POINT_ID );
}

function traffic(from, to) {
    return {
        from : from,
        to   : to,
    };
}

function shuffler() {
    return Math.round( Math.random() * 2 - 1 );
}

setInterval(start_spam, config.SPAM_INTERVAL);
