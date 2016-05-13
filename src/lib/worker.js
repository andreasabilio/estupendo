
var co        = require('co');
var transport = require('./transport');

// Module store
var _modules = {};

var _domInsert = function(modId, modSrc){
    "use strict";

    // XXX
    // console.log('***', modSrc);

    // Wrap module
    var wrapped = "window.estupendo.run('"
        + modId
        + "',"
        + "function*(module){\n"
        + "console.log('RUNNING GENERATOR');\n"
        + modSrc.split('require(').join('yield require(')
        + "\n// Return to estupendo"
        + "\nreturn module;\n});";

    // XXX
    console.log('WRAPPED:', wrapped);


    // Nodes
    var scriptNode = document.createElement("script");
    var headNode   = document.querySelector('head');

    // Node settings
    scriptNode.id        = modId;
    scriptNode.innerHTML = wrapped;
    scriptNode.type      = "text\/javascript";

    // XXX
    // console.log('>>> Placing module in DOM');

    // Insert into DOM and thereby run
    headNode.appendChild(scriptNode);
};

module.exports = {

    require: function(modId){
        "use strict";

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // XXX
        console.log('### Running worker require');

        // Store module promise
        _modules[modId] = transport.async(modId).then(function(msg){

            // XXX
            // console.log('>>> DOM:', msg.data);

            _domInsert(modId, msg.data[0]);
        });

        // Return promise
        return _modules[modId];
    },

    run: function(modId, modFn){

        // // Is module known?
        // if( modId in _modules )
        //     return;

        // XXX
        // console.log('>>> RUNNING', modId);

        // Run module generator
        var exported = co.wrap(modFn)({});

        // Analyze module && store pointer
        if( 'exports' in exported && exported.exports)
            _modules[modId] = exported.exports;
        else
            _modules[modId] = exported;
    }
};