"use strict";

var generateIndexes = require("./helpers/wrappers").generateIndexes;
var removeParam = require("./helpers/utils").removeParam;
var log = require("debug")("mock-meddleware");
var replacer = require("require-replacer");

module.exports = function(options) {

    log("wrappers config run");

    var loaded = false;
    var indexes = {};
    var wrappers = options.wrappers.mappings || [];
    var contextPath = options.requestURI || '';
    var wrappersEnabled = !!options.wrappers.enabled;
    var mockFolder = options.mocks.folder;
    var mockFolderStructure = options.mocks.structure;
    var mockParams = [];

    if (!wrappersEnabled) {
        log("wrappers disable");
        return function(req, res, next) { next(); };
    }

    indexes = generateIndexes(wrappers);

    if (!loaded) {
        /**
        *   This is initialize the wrappers once
        */
        wrappers.forEach(function(item) {
            function replaceWrapper(methodCall) {

                var wrapper = require(item.wrapper);
                var mockDataLocation = mockFolder;

                mockParams.forEach(function(param) {
                    mockDataLocation += "/" + param;
                });

                mockDataLocation += "/" + item.prefix + "." + indexes[item.prefix] + ".json";

                log("mockDataLocation - %s", mockDataLocation);

                var index = indexes[item.prefix];
                var json = requireUncached(mockDataLocation);

                log("%s.index(%s).json loaded", item.prefix, index);

                indexes[item.prefix]++;
                return wrapper(methodCall, index, json);
            }
            log("%s - replaced with - %s", item.replace, item.wrapper);

            if (item.objectKey && typeof(item.objectKey) === "string"){
                replacer.replace(replaceWrapper, item.replace, item.objectKey);
            } else {
                replacer.replace(replaceWrapper, item.replace);
            }

        });
        loaded = true;
        log("locked and loaded");
    }

    return function(req, res, next) {

        if (Array.isArray(mockParams) && mockParams.length === 0){
            mockFolderStructure.forEach(function(item) {
                mockParams[mockParams.length] = req.query[item];
            });
        }

        if (req.query.reset) {

            log("mocks indexes reset");
            mockParams = [];
            mockFolderStructure.forEach(function(item) {
                mockParams[mockParams.length] = req.query[item];
            });

            indexes = generateIndexes(wrappers);
            var redirectURI = contextPath +  removeParam(["reset","ts"], req.url) + "&ts=" + new Date().getTime();

            log("Redirect URI - %s", redirectURI);
            return res.redirect(redirectURI);
        } else {
            log("did intercept");
            return next();
        }
    };
};

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}
