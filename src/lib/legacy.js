
// Get transport utility
var _modRunner = require('./modRunner');
var _transport = require('./transport');

// Module store
var _modules = {};

module.exports = {

    require: function(modId){

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // Fetch
        var modSrc = _transport.sync(modId);

        // Place in DOM and run
        _modRunner(modId, modSrc);

        // DEV: In time?
        return _modules[modId];
    },

    run: function(modId, modFn){

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