
// Non-module
var script = require('/src/script.js');
script();


// Simple
var arrDiff    = require('arr-diff');
var arrFlatten = require('arr-flatten');

var a = ['a', 'b', 'c', 'd'];
var b = ['b', 'c'];

console.log('        a =', a);
console.log('        b =', b);
console.log('   arrDiff:', arrDiff(a, b));
console.log('arrFlatten:', arrFlatten([a, b]));



// Complex
var async = require('async');
console.log('ASYNC:', async);


// XSS
var wrong = require('http://www.google.com');

module.exports = {main: true};
