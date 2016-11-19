'use strict';

var mockMeddleware = require('../../lib');

var express = require('express');

function setup(options, init) {

    var app = express();

    app.engine('html', function(file, opts, cb) {
        cb(null, opts);
    });

    app.set('view engine', 'html');

    app.use(mockMeddleware(options));

    app.get('/functionMock', function(req, res) {
        var generateTextPath = options.replace;

        var executeFunction=require(generateTextPath);

        var text = executeFunction('hello world');
        console.log(text);
        res.json({text: text});
    });

    app.get('/objectFunctionMock', function(req, res) {
        var generateTextPath = options.replace;

        var executeFunction=require(generateTextPath).getText;

        var text = executeFunction('hello world');
        console.log(text);
        res.json({text: text});
    });

    var server = app.listen(12346, function() {
        init(function(con) {
            server.close();
        });
    });
}

module.exports = setup;
