
// var Promise = require('promise-polyfill');
// var setAsap = require('setasap');
//     Promise._setImmediateFn(setAsap);

var dosync = require('./syncker');

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

        // XXX
        // var result = dosync(requestWorker, modId);
        // console.log('  ');
        // console.log('### RESULT:', result);

        var result = dosync(function(args, cb){
            console.log('ASYNC run with:', args);
            setTimeout(function(){
                cb(args);
            }, 5000);
        }, 'hello world!!');
        console.log(' ');
        console.log('>>> RESULT:', result);

        // DEV
        return result;
    },

    run: function(modId, modFn){
        "use strict";

    }
};