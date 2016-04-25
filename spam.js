var ids = [1, 2, 3, 4, 5];

const INTERNET_ID = 0;
const ENTRY_POINT_ID = 1;
const PUBLIC_PERCENTAGE = 0.2; // percentage of fake traffic that comes from public internet

const config = require('./config');
var http = require('http');

function start_spam() {
    var payload = JSON.stringify(random_traffic());
    var post = http.request({
        host: 'localhost',
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
}

function random_traffic() {
    // return either inter-microservice traffic or public internet traffic
    var retval;

    if (Math.random() > 0.2) {
        retval = random_microservice_traffic();
    }
    else {
        retval = public_traffic();
    }

    return retval;
}

function random_microservice_traffic() {
    ids.sort(shuffler);
    return traffic( ids[0], ids[1] );
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
