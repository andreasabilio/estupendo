
var co        = require('co');
    // = require('./runmod');
var transport = require('./transport');

// Module store
var modules = {};
var buffer  = null;

var runmod = function(modId, modSrc){
    "use strict";

    // Wrap module
    var wrapped = "window.estupendo.run('"
        + modId
        + "',"
        + "function*(module, exports){\n"
        + modSrc.split('require(').join('yield require(')
        + "\n// Return to estupendo"
        + "\nreturn module.exports || exports;\n});";


    // Nodes
    var scriptNode = document.createElement("script");
    var headNode   = document.querySelector('head');

    // Node settings
    scriptNode.id        = modId.split('/').join(':');
    scriptNode.innerHTML = wrapped;
    scriptNode.type      = "text\/javascript";

    // Insert into DOM and thereby run
    headNode.appendChild(scriptNode);
};

module.exports = {

    config: {
        modules:    'node_modules',
        loadPackage: false,
        timeout:     7000
    },

    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in modules)
            return modules[modId];

        // Store module promise
        modules[modId] = transport(modId).then(function(modSrc){
            // console.log('worker modSrc:', modSrc);
            runmod(modId, modSrc);
            return buffer;
        });

        // Return promise
        return modules[modId];
    },

    run: function(modId, modFn){
        buffer = co.wrap(modFn)({}, null);
    }
};