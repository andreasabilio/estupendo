
var co        = require('co');
var runmod    = require('./runmod');
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

        // console.log('>>>', window.estupendo);

        // Store module promise
        _modules[modId] = transport(modId).then(function(module){
            // console.log('worker module:', module);
            runmod(modId, module);
            return _buffer;
        });

        // Return promise
        return _modules[modId];
    },

    run: function(modId, modFn){
        _buffer = co.wrap(modFn)({}, null);
    }
};