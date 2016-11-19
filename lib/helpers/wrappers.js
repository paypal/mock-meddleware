"use strict";

/* helpers */
function generateIndexes(wrappers) {

    var indexes = {};

    wrappers.forEach(function(item) {
        indexes[item.prefix] = 1;
    });

    return indexes;
}

module.exports = {
    generateIndexes: generateIndexes
};
