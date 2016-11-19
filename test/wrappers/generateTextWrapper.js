'use strict'

module.exports = function wrapperAdvice(methodCall, index, json) {
    return json.text;
}
