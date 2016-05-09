
(function(){
    "use strict";

    // Get transport tools
    var _transport = require('./lib/transport');

    // Module store
    var _modules = {};


    // Abort if require is already defined
    if( 'require' in window ){
        throw new Error('Estupendo ERROR: window.require is already defined');
    }

    // Abort if require is already defined
    if( 'estupendo' in window ){
        throw new Error('Estupendo ERROR: window.estupendo is already defined');
    }


    // Define global estupendo object
    var estupendo = window.estupendo = {

        require: function(modId){

            // Fetch?
            if( modId in _modules)
                return _modules[modId];

            // Fetch
            var modSrc = _transport.get(modId);

            // Wrap module
            var wrapped = "window.estupendo.run("
                + modId
                + ","
                + "function(module){"
                + " 'use strict;' "
                + modSrc
                + " return module; })";


            var scriptNode = document.createElement("script");
            var headNode   = document.querySelector('head');

            scriptNode.innerHTML = wrapped;
            scriptNode.type      = "text\/javascript";
            // scriptNode.onerror   = function(){
            //     console.log('ERROR:', arguments);
            // };

            // Insert into DOM and run module
            headNode.appendChild(scriptNode);

            return _modules[modId];
        },

        run: function(modId, modFn){

            // Is module known?
            if( modId in _modules )
                return;

            // Define module object
            var module = {};

            // Run wrapper and store reference
            _modules[modId] = modFn(module);
        }

        // fail: function(e){
        //     "use strict";
        //     throw e;
        // }

        // _require: function(path){
        //     "use strict";
        //
        //     _transport
        //         .get(path)
        //         .then(estupendo.load.bind({}, path), estupendo.fail);
        //
        // },

        // load: function(modName, modSrc){
        //     "use strict";
        //
        //     var module = "window.estupendo.run("
        //         + modName
        //         + ","
        //         + "function(module){"
        //         + " 'use strict;' "
        //         + modSrc
        //         + " return module; })";
        //
        //     // var module = {exports: null};
        //     //
        //     // var x = eval('"use strict;" ' + scriptSrc);
        //     //
        //     // console.log('MODULE:', module);
        //     //
        //     // return module.exports;
        //
        //
        //     var scriptNode = document.createElement("script");
        //     var headNode   = document.querySelector('head');
        //
        //
        //     scriptNode.innerHTML = module;
        //     scriptNode.type      = "text\/javascript";
        //     scriptNode.onerror   = function(){
        //         console.log('ERROR:', arguments);
        //     };
        //
        //     headNode.appendChild(scriptNode);
        // },
    };

    // Register global require function
    window.require = estupendo.require;



    // DEV //////////////////////////////////////////////////////////
    var script = window.require('/script.js');

    console.log('SCRIPT:', script);

    script('mundo!');

})();

