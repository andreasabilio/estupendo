
var Promise = require('promise-polyfill');
var setAsap = require('setasap');
    Promise._setImmediateFn(setAsap);

// Module store
var _modules = {};

var requestWorker = function(modId, callback){
    "use strict";

    // Start worker
    var worker = new window.Worker('/src/worker.js');

    // Attach callback
    worker.onmessage = callback;

    // Supply params to worker
    worker.postMessage(modId);

    // worker.terminate();
};

module.exports = {

    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // XXX
        console.log('### Running worker require');

        return new Promise(function(resolve, reject){

            

        });
    },

    run: function(modId, modFn){
        "use strict";

        // Is module known?
        if( modId in _modules )
            return;

        // Run module
        var exported = modFn({});

        // Analyze module && store pointer
        if( 'exports' in exported && exported.exports)
            _modules[modId] = exported.exports;
        else
            _modules[modId] = exported;
    }
};