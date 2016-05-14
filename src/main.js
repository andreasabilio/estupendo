
// DEV //////////////////////////////////////////////////////////

// window.estupendo.load('arr.diff', {});

console.log('ESTUPENDO:', estupendo);

// require('arr-diff').then(function(module){
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
//     require('arr-flatten').then(function(arrFlatten){
//         console.log(arrFlatten([a, b]));
//     });
// });



var a = ['a', 'b', 'c', 'd'];
var b = ['b', 'c'];

var arrDiff = require('arr-diff');
var arrFlatten = require('arr-flatten');

console.log(arrDiff(a, b));
console.log(arrFlatten([a, b]));