"use strict";

// Abort if require is already defined
if( 'require' in window ){
    throw new Error('Estupendo ERROR: window.require is already defined');
}

// Get dependencies
var assignDeep = require('assign-deep');
var core       = require('./lib/core');
var dataset    = JSON.parse(JSON.stringify(document.currentScript.dataset));

var components = [
    estupendo || {},
    core,
    {config: dataset}
];

// Define global estupendo object
var estupendo = window.estupendo = assignDeep.apply(null, components);

// Register global require function
window.require = estupendo.require;

// Run main script?
if(estupendo.config.main)
    estupendo.require(estupendo.config.main);
