
var Promise = require('promise-polyfill');
var setAsap = require('setasap');
    Promise._setImmediateFn(setAsap);

// Module store
var _modules = {};

module.exports = {

    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // XXX
        console.log('>>> Running worker require');
    },

    run: function(modId, modFn){
        "use strict";

    }
};