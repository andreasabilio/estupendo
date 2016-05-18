
var co        = require('co');
var transport = require('./transport');

// Module store
var modules = {};
var buffer  = null;

// Module runner
var runmod = function(modId, modSrc){
    "use strict";

    // Wrap module
    var wrapped = "window.estupendo.run('"
        + modId
        + "',"
        + "function*(module, exports){\n"
        + modSrc.split('require(').join('yield require(')
        + "\n// Return to estupendo"
        + "\nreturn module.exports || exports;\n\n});";


    // Nodes
    var scriptNode = document.createElement("script");
    var headNode   = document.querySelector('head');

    // Script id
    var scriptId = (function(){
        var main = window.estupendo.config.main;
        return (main === modId)? 'main' : modId;
    })();

    // Node settings
    scriptNode.id        = scriptId;
    scriptNode.innerHTML = wrapped;
    scriptNode.type      = "text\/javascript";

    // Insert into DOM and thereby run
    headNode.appendChild(scriptNode);
};


module.exports = {

    // Default config
    config: {
        modules:    'node_modules',
        loadPackage: false,
        timeout:     7000
    },

    // Public require
    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in modules)
            return modules[modId];

        // Store module promise && run
        modules[modId] = transport(modId).then(function(modSrc){
            // XXX
            // console.log('SOURCE:', modSrc);
            runmod(modId, modSrc);
            return buffer;
        });

        // Return promise
        return modules[modId];
    },

    // Async runner
    run: function(modId, modFn){
        buffer = co.wrap(modFn)({exports: {}}, null);
    }
};