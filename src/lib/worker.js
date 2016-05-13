
var co        = require('co');
var transport = require('./transport');

// Module store
var _modules = {};
var _buffer  = null;

var _domInsert = function(modId, modSrc){
    "use strict";

    // Wrap module
    var wrapped = "window.estupendo.run('"
        + modId
        + "',"
        + "function*(module){\n"
        + modSrc.split('require(').join('yield require(')
        + "\n// Return to estupendo"
        + "\nreturn module;\n});";


    // Nodes
    var scriptNode = document.createElement("script");
    var headNode   = document.querySelector('head');

    // Node settings
    scriptNode.id        = modId;
    scriptNode.innerHTML = wrapped;
    scriptNode.type      = "text\/javascript";

    // Insert into DOM and thereby run
    headNode.appendChild(scriptNode);
};

module.exports = {

    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // Store module promise
        _modules[modId] = transport.async(modId).then(function(msg){
            _domInsert(modId, msg.data[0]);
            return _buffer;
        });

        // Return promise
        return _modules[modId];
    },

    run: function(modId, modFn){

        var module = co.wrap(modFn);

        _buffer = module({}).then(function(mod){
            "use strict";

            return mod.exports || mod;

        });
    }
};