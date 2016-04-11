const ids = [0, 1, 2, 3];

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
    ids.sort(shuffler);
    return {
        from : ids[0],
        to   : ids[1],
    };
}

function shuffler() {
    return Math.round( Math.random() * 2 - 1 );
}

setInterval(start_spam, 5);
