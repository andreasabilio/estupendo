
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
    var _dataset = document.currentScript.dataset;
    var _rootUrl = (function(){

        var href = window.location.href;
        return href;
    })();

    _estupendo.config         = JSON.parse(JSON.stringify(_dataset));
    _estupendo.config.rootUrl = _rootUrl;


    // Define global estupendo object
    if(window.Worker)
        Object.assign(_estupendo, _worker);
    else
        Object.assign(_estupendo, _legacy);

    // Register global require function
    window.require = _estupendo.require;

})();



// DEV //////////////////////////////////////////////////////////

// window.estupendo.load('arr.diff', {});

console.log('ESTUPENDO:', estupendo);

window.require('arr-diff').then(function(module){
    "use strict";

    // console.log('MODULE:', module);

    if( 'function' !== typeof module )
        return module;

    var a = ['a', 'b', 'c', 'd'];
    var b = ['b', 'c'];
    console.log(module(a, b));

    window.require('arr-flatten').then(function(arrFlatten){
        console.log(arrFlatten([a, b]));
    });
});

// var a = ['a', 'b', 'c', 'd'];
// var b = ['b', 'c'];

// console.log(arrDiff(a, b));
