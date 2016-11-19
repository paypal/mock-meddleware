'use strict';

var test = require('tape');
var _ = require('lodash');
var mockMeddleware = require('../lib');
var server = require('./express/server');
var client = require('./express/client');

var replaceFunctionPath = __dirname + "/functions/generateFunction.js";
var replaceObjectFunctionPath = __dirname + "/functions/generateObjectFunction.js";
var wrapperPath = __dirname + "/wrappers/generateTextWrapper.js";
var mocksPath = __dirname + "/mocks";

var optionsUsingFunction = {
    "mocks": {
        "folder": mocksPath,
        "structure": ["scenarios"]
    },
    "wrappers": {
        "enabled": true,
        "mappings": [{
            "prefix": "text",
            "replace": replaceFunctionPath,
            "wrapper": wrapperPath
        }]
    }
}

var optionsUsingObjectKey = {
    "mocks": {
        "folder": mocksPath,
        "structure": ["scenarios"]
    },
    "wrappers": {
        "enabled": true,
        "mappings": [{
            "prefix": "text",
            "replace": replaceObjectFunctionPath,
            "wrapper": wrapperPath,
            "objectKey": "getText"
        }]
    }
}

test('when wrappers are disabled', function(t) {

    var modifiedOptions = _.assign({}, optionsUsingFunction);
    modifiedOptions.wrappers = _.assign({}, optionsUsingFunction.wrappers);
    modifiedOptions.wrappers.enabled = false;
    modifiedOptions.replace = optionsUsingFunction.wrappers.mappings[0].replace;


    server(modifiedOptions, function(done) {
        t.plan(1);

        client('/functionMock?scenarios=text', function(err, data) {
            var parsedData = JSON.parse(data);
            t.equal(parsedData.text, "hello world",
                "Expected output Text: hello world");
            done();
        });
    });
});

test('if the mocking wrapper is working in express middleware using function replacement', function(t) {

    var modifiedOptions = _.assign({}, optionsUsingFunction);
    modifiedOptions.replace = optionsUsingFunction.wrappers.mappings[0].replace;

    server(modifiedOptions, function(done) {
        client('/functionMock?scenarios=text', function(err, data) {
            t.plan(1);
            var parsedData = JSON.parse(data);
            t.equal(parsedData.text, "this is a wrapper",
                "Expected output Text: this is  a wrapper");
            done();
        });
    });
});

test('if the mocking wrapper is working in express middleware using object key replacement', function(t) {

    var modifiedOptions = _.assign({}, optionsUsingObjectKey);
    modifiedOptions.replace = optionsUsingObjectKey.wrappers.mappings[0].replace;

    server(modifiedOptions, function(done) {
        client('/objectFunctionMock?scenarios=text', function(err, data) {
            t.plan(1);
            var parsedData = JSON.parse(data);
            t.equal(parsedData.text, "this is a wrapper",
                "Expected output Text: this is  a wrapper");
            done();
        });
    });
});

test('if jsons are loaded in sequence and in index increases', function(t) {

    var modifiedOptions = _.assign({}, optionsUsingFunction);
    modifiedOptions.replace = optionsUsingFunction.wrappers.mappings[0].replace;

    server(modifiedOptions, function(done) {
        t.plan(2);

        client('/functionMock?scenarios=text', function(err, data) {
            var parsedData = JSON.parse(data);
            t.equal(parsedData.text, "this is a wrapper",
                "Expected output Text: this is a wrapper");
            client('/functionMock?scenarios=text', function(err, data1) {
                var parsedData1 = JSON.parse(data1);
                t.equal(parsedData1.text, "this is still a wrapper",
                    "Expected output Text: this is still a wrapper");
                done();
            });
        });
    });
});

test('if reset is working', function(t) {

    var modifiedOptions = _.assign({}, optionsUsingFunction);
    modifiedOptions.replace = optionsUsingFunction.wrappers.mappings[0].replace;

    server(modifiedOptions, function(done) {
        t.plan(2);

        client('/functionMock?scenarios=text', function(err, data) {
            var parsedData = JSON.parse(data);
            t.equal(parsedData.text, "this is a wrapper",
                "Expected output Text: this is a wrapper");
            client('/functionMock?scenarios=text&reset=1', function(err, data1) {
                if (data1.headers.location.indexOf('reset') === -1 &&
                    data1.headers.location.indexOf('ts') > -1) {
                    t.ok(data1.headers.location,
                        "reset header is not found and timestamp is found");
                } else {
                    t.notOk(data1.headers.location,
                        "reset header should have been removed or timestamp should be placed");
                }
                done();
            });
        });
    });
});
