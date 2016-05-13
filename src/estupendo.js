
(function(){
    "use strict";

    // Get dependencies
    var _legacy    = require('./lib/legacy');
    var _worker    = require('./lib/worker');
    var _estupendo;

    // Errors
    var _requireE   = 'Estupendo ERROR: window.estupendo is already defined';
    var _estupendoE = 'Estupendo ERROR: window.require is already defined';


    // Abort if require is already defined
    if( 'require' in window ){
        throw new Error(_requireE);
    }

    // Abort if require is already defined
    if( 'estupendo' in window ){
        throw new Error(_estupendoE);
    }


    // Define global estupendo object
    if(window.Worker)
        _estupendo = window.estupendo = _worker;
    else
        _estupendo = window.estupendo = _legacy;

    // Register global require function
    window.require = _estupendo.require;

})();




// DEV //////////////////////////////////////////////////////////

var arrDiff = window.require('arr-diff').then(function(module){
    "use strict";

    console.log('MODULE:', module);

    if( 'function' !== typeof module )
        return module;

    var a = ['a', 'b', 'c', 'd'];
    var b = ['b', 'c'];
    console.log(module(a, b));
});

// console.log('SCRIPT:', arrDiff);

// var a = ['a', 'b', 'c', 'd'];
// var b = ['b', 'c'];

// console.log(arrDiff(a, b));
