"use strict";

// Get dependencies
var assignDeep = require('assign-deep');
var core       = require('./lib/core');
var messages   = require('./lib/messages');
var dataset    = JSON.parse(JSON.stringify(document.currentScript.dataset));


// Abort if require is already defined
if( 'require' in window ){
    throw new Error(messages.error.requireExists);
}


// Setup estupendo components
var components = [
    window.estupendo || {},    // Allow defining settings in advance
    core,                      // Core functions
    {config: dataset}          // Prioritize config from tag data attributes
];

// Define global estupendo object
var estupendo = window.estupendo = assignDeep.apply(null, components);


// Register global require function
window.require = estupendo.require;

// Run main script?
if(estupendo.config.main)
    estupendo.require(estupendo.config.main);
