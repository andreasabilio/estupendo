(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

(function(){
    "use strict";

    // Get dependencies
    var _legacy    = require('./lib/legacy');
    var _worker    = require('./lib/worker');
    var _estupendo;


    // Abort if require is already defined
    if( 'require' in window ){
        throw new Error('Estupendo ERROR: window.require is already defined');
    }

    // Abort if require is already defined
    if( 'estupendo' in window ){
        throw new Error('Estupendo ERROR: window.estupendo is already defined');
    }


    // Define global estupendo object
    if(window.Worker)
        _estupendo = window.estupendo = _worker;
    else
        _estupendo = window.estupendo = _legacy;

    // Register global require function
    window.require = _estupendo.require;

})();




// DEV //////////////////////////////////////////////////////////

var arrDiff = window.require('arr-diff');

// console.log('SCRIPT:', script);

var a = ['a', 'b', 'c', 'd'];
var b = ['b', 'c'];

console.log(arrDiff(a, b));

},{"./lib/legacy":2,"./lib/worker":5}],2:[function(require,module,exports){

// Get transport utility
var _transport = require('./transport');

// Module store
var _modules = {};

module.exports = {

    require: function(modId){

        // Fetch?
        if( modId in _modules)
            return _modules[modId];

        // Fetch
        var modSrc = _transport.get(modId);

        // Wrap module
        var wrapped = "window.estupendo.run('"
            + modId
            + "',"
            + "function(module){"
            + modSrc
            + " return module; });";


        var scriptNode = document.createElement("script");
        var headNode   = document.querySelector('head');

        scriptNode.id        = modId;
        scriptNode.innerHTML = wrapped;
        scriptNode.type      = "text\/javascript";

        // Insert into DOM and run module
        headNode.appendChild(scriptNode);

        // DEV: In time?
        return _modules[modId];
    },

    run: function(modId, modFn){

        // Is module known?
        if( modId in _modules )
            return;

        // Define module object
        var module = {};

        // Run module
        var exported = modFn(module);

        // Analyze module && store pointer
        if( 'exports' in exported && exported.exports)
            _modules[modId] = exported.exports;
        else
            _modules[modId] = exported;
    }
}
},{"./transport":4}],3:[function(require,module,exports){

var status = module.exports = {
    '200': function(){
        "use strict";

        // XXX
        // console.log('<<< 200');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return [this.responseText];
        }
    },
    '304': function(){
        "use strict";

        // XXX
        console.log('<<< 304');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return this.responseText;
        }
    },
    '404': function(){
        "use strict";

        // XXX
        console.log('<<< 404: Not found!');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return this.responseText;
        }
    }
};
},{}],4:[function(require,module,exports){

var status = require('./status');

module.exports = {
    get: function(target){
        "use strict";

        var _xhr    = new XMLHttpRequest();
        var _method = 'GET';
        var _url    = encodeURI('modules/' + target + '/index.js');
        var _async  = false;

        // Open sync connection
        _xhr.open(_method, _url, _async);
        _xhr.send(null);

        // Known status code?
        if( !(_xhr.status in status) )
            throw new Error('Estupendo ERROR: unknown status code');


        // Handle response
        return status[_xhr.status].call(_xhr);
    }
};
},{"./status":3}],5:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./transport":4,"dup":2}]},{},[1]);
