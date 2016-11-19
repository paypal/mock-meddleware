'use strict';

function request(path, callback) {
    var req = require('http').request({
        method: 'GET',
        port: 12346,
        path: path
    }, function(res) {
        var data = [];

        res.on('data', function(chunk) {
            data.push(chunk);
        });

        res.on('end', function() {
            var body = Buffer.concat(data).toString('utf8');
            if (res.statusCode === 302) {
                callback(null, res);
                return;
            }
            if (res.statusCode !== 200) {
                callback(new Error(body));
                return;
            }
            callback(null, body);
        });

    });

    req.on('error', callback);
    req.end();
}

module.exports = request
