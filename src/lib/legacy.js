
// Get transport utility
var _transport = require('./transport');

// Module store
var _modules = {};

module.exports = {

    require: function(modId){

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // Fetch
        var modSrc = _transport.get(modId);

        // Wrap module
        var wrapped = "window.estupendo.run('"
            + modId
            + "',"
            + "function(module){"
            + modSrc
            + " return module; });";


        var scriptNode = document.createElement("script");
        var headNode   = document.querySelector('head');

        scriptNode.id        = modId;
        scriptNode.innerHTML = wrapped;
        scriptNode.type      = "text\/javascript";

        // Insert into DOM and run module
        headNode.appendChild(scriptNode);

        // DEV: In time?
        return _modules[modId];
    },

    run: function(modId, modFn){

        // Is module known?
        if( modId in _modules )
            return;

        // Define module object
        var module = {};

        // Run module
        var exported = modFn(module);

        // Analyze module && store pointer
        if( 'exports' in exported && exported.exports)
            _modules[modId] = exported.exports;
        else
            _modules[modId] = exported;
    }
}