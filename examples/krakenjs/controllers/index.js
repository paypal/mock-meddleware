'use strict';


var IndexModel = require('../models/index');

module.exports = function (router) {

    router.get('/*', function (req, res) {

        res.send('<code><pre>' + JSON.stringify(new IndexModel(), null, 2) + '</pre></code>');

    });

};
