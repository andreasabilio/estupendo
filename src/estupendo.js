
var _         = require('lodash');
var semver    = require('semver');
var DepGraph  = require('dependency-graph').DepGraph;
var transport = require('./lib/transport');

// Abort if require is already defined
if( 'require' in window ){
    throw new Error('Estupendo ERROR: window.require is already defined');
}

var estupendo = {

    graph: new DepGraph(),


    load: function(pkgs){
        var modules = pkgs.map(function(scriptSrc){
            "use strict";

            var module = {exports: null};

            var x = eval('"use strict;" ' + scriptSrc);

            console.log('MODULE:', module);

            return module.exports;

            // var scriptNode = document.createElement("script");
            // var headNode   = document.querySelector('head');
            //
            //
            // scriptNode.type    = "text\/javascript";
            // // scriptNode.src     = scriptUrl;
            // scriptNode.onerror = function(){
            //     console.log('ERROR:', arguments);
            // };
            //
            // headNode.appendChild(scriptNode);
        });


    },

    fail: function(e){
        "use strict";
        throw e;
    }
};

// Require function
window.require = function(path){
    "use strict";

    transport
        .get(path)
        .then(estupendo.load, estupendo.fail);

};



// DEV
var script = window.require('/script.js');
// window.require(['/modules/', '', '/index.js'].join(''));

console.log('SCRIPT:', script);

script('mundo!');