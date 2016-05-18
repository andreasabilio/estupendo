"use strict";

var errors = require('./lib/errors');

// Abort if require is already defined
if( 'require' in window ){
    throw new Error(errors.requireExists);
}

// Get dependencies
var assignDeep = require('assign-deep');
var core       = require('./lib/core');
var dataset    = JSON.parse(JSON.stringify(document.currentScript.dataset));

var components = [
    estupendo || {},    // Allow defining settings in advance
    core,               // Core functions
    {config: dataset}   // Prioritize tag data attribute settings
];

// Define global estupendo object
var estupendo = window.estupendo = assignDeep.apply(null, components);

// Register global require function
window.require = estupendo.require;

// Run main script?
if(estupendo.config.main)
    estupendo.require(estupendo.config.main);
