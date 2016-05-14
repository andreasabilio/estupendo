
(function(){
    "use strict";

    // Abort if require is already defined
    if( 'require' in window ){
        throw new Error('Estupendo ERROR: window.require is already defined');
    }

    // Abort if estupendo is already defined
    if( 'estupendo' in window ){
        throw new Error('Estupendo ERROR: window.require is already defined');
    }

    // Get dependencies
    var _legacy    = require('./lib/legacy');
    var _worker    = require('./lib/worker');
    var _estupendo = window.estupendo = {};

    // Setup configuration
    var _dataset      = document.currentScript.dataset;
    _estupendo.config = JSON.parse(JSON.stringify(_dataset));

    // Define global estupendo object
    Object.assign(_estupendo, (window.Worker)? _worker : _legacy);

    // Register global require function
    window.require = _estupendo.require;

    // TODO
    // Require returning promise
    // and accepting a generator fn in then()
    window.grequire = function(){};

    // TODO
    // Require all modules in array
    // (possibly parallel)
    window.requireAll = function(modList){};

    // Run main script?
    if(_estupendo.config.main)
        _estupendo.require(_estupendo.config.main);

})();


// DEV //////////////////////////////////////////////////////////

console.log('ESTUPENDO:', estupendo);