
(function(){
    "use strict";

    // Get dependencies
    var _legacy    = require('./lib/legacy');
    var _worker    = require('./lib/worker');
    var _estupendo = window.estupendo || {};


    // Abort if require is already defined
    if( 'require' in window ){
        throw new Error('Estupendo ERROR: window.require is already defined');
    }


    // Define global estupendo object
    if(window.Worker)
        Object.assign(_estupendo, _worker);
        // _estupendo = window.estupendo = _worker;
    else
        Object.assign(_estupendo, _legacy);
        // _estupendo = window.estupendo = _legacy;

    // Register global require function
    window.require = _estupendo.require;

})();




// DEV //////////////////////////////////////////////////////////

var arrDiff = window.require('arr-diff').then(function(module){
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

console.log('ESTUPENDO:', estupendo);

// var a = ['a', 'b', 'c', 'd'];
// var b = ['b', 'c'];

// console.log(arrDiff(a, b));
