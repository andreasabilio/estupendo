
var co        = require('co');
var domInsert = require('./domInsert');
var transport = require('./transport');

// Module store
var _modules = {};
var _buffer  = null;

module.exports = {

    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // Store module promise
        _modules[modId] = transport.async(modId).then(function(msg){
            domInsert(modId, msg.data[0]);
            return _buffer;
        });

        // Return promise
        return _modules[modId];
    },

    run: function(modId, modFn){
        _buffer = co.wrap(modFn)({});
    }
};