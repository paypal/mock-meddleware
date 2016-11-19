var express = require('express');
var app = express();
var mockMiddleware = require('../../lib');

var options = {
    "requestURI": "/",
    "mocks": {
        "folder": __dirname + "/mocks",
        "structure": ["type"]
    },
    "wrappers": {
        "enabled": true,
        "mappings": [{
            "prefix": "random",
            "replace": __dirname + "/realFile",
            "wrapper": __dirname + "/mocks/wrappers/wrapperFile"
        }]
    }
}

app.use(mockMiddleware(options));

var getWord = require('./realFile');

app.get('/*', function (req, res) {
  res.send(getWord());
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
