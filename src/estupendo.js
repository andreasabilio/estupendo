
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

    // {
    //     root:    window.location.href,
    //     main:    _dataset.main,
    //     modules: _dataset.modules || 'node_modules'
    // };

    // Define global estupendo object
    Object.assign(_estupendo, (window.Worker)? _worker : _legacy);

    // Register global require function
    window.require = _estupendo.require;

    // TODO
    // Require returning promise
    // and accepting a generator fn in then()
    window.grequire = function(){};

    // Run main script?
    if(_estupendo.config.main)
        _estupendo.require(_estupendo.config.main);

})();


//
// // DEV //////////////////////////////////////////////////////////
//
// // window.estupendo.load('arr.diff', {});
//
// console.log('ESTUPENDO:', estupendo);
//
// window.require('arr-diff').then(function(module){
//     "use strict";
//
//     // console.log('MODULE:', module);
//
//     if( 'function' !== typeof module )
//         return module;
//
//     var a = ['a', 'b', 'c', 'd'];
//     var b = ['b', 'c'];
//     console.log(module(a, b));
//
//     window.require('arr-flatten').then(function(arrFlatten){
//         console.log(arrFlatten([a, b]));
//     });
// });
//
// // var a = ['a', 'b', 'c', 'd'];
// // var b = ['b', 'c'];
//
// // console.log(arrDiff(a, b));
