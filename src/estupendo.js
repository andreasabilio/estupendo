
(function(){
    "use strict";

    // Get transport tools
    var _transport = require('./lib/transport');

    // Module store
    var _modules = {};


    // Abort if require is already defined
    if( 'require' in window ){
        throw new Error('Estupendo ERROR: window.require is already defined');
    }

    // Abort if require is already defined
    if( 'estupendo' in window ){
        throw new Error('Estupendo ERROR: window.estupendo is already defined');
    }


    // Define global estupendo object
    var estupendo = window.estupendo = {

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
                // + " 'use strict;' "
                + " console.log('+++ Running module'); "
                + " module = {fromModule: true}; "
                // + modSrc
                + " return module; });";


            var scriptNode = document.createElement("script");
            var headNode   = document.querySelector('head');

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

            // Run wrapper and store reference
            _modules[modId] = modFn(module);
        }
    };

    // Register global require function
    window.require = estupendo.require;

})();




// DEV //////////////////////////////////////////////////////////
var script = window.require('/script.js');

console.log('SCRIPT:', script);

// script('mundo!');
