

// var riww   = require('./riww');
var status  = require('./status');
var Promise = require('promise-polyfill');
var setAsap = require('setasap');
    Promise._setImmediateFn(setAsap);


var getModFile = function(config){
    "use strict";

    if(!config.loadPackage)
        return '/index.js';

    // TODO
    return false;
};


var buildUrl = function(target){
    "use strict";
    
    // Parse defaults && policy
    var config = Object.assign({}, window.estupendo.config, {
        root: window.location.href
    });

    // XXX
    // console.log('CONFIG:', config);

    // Setup
    var url    = [config.root];
    var prefix = target.substring(0,1);

    // Build url
    switch(prefix){
        case '/':
            url.push(target.replace('/', ''));
            break;
        case './':
            url.push(target.replace('./', ''));
            break;
        case 'h':
            throw new Error('Estupendo ERROR: Only same -origin requests are supported');
            break;
        default:
            url.push(config.modules.split('/').join('') + '/');
            url.push(target);
            url.push(getModFile(target));
    }

    return url.join('');

};


var request = function(target){
    "use strict";

    // Setup
    var out;
    var req    = new XMLHttpRequest();
    var method = 'GET';
    var url    = encodeURI(target);
    var async  = window.estupendo.config.async || true;

    // XXX
    // console.log('>>> url', url);

    // Open sync connection
    req.open(method, url, async);

    if(async){
        out = new Promise(function(resolve, reject){

            // Register load handler
            req.addEventListener("load", function(){
                resolve({
                    status: req.status,
                    response: req.responseText
                });
            });

            // Run request
            req.send(null);

            // Setup timeout
            setTimeout(function(){
                var error = new Error('riww ERROR: Async request worker timed out', arguments);
                reject(error);
            }, window.estupendo.config.timeout);
        });
    }else{
        out = {
            status: req.status,
            response: req.responseText
        };
    }

    return out;
};

module.exports = function(modId){
    "use strict";

    // Run In Web Worker
    return request(buildUrl(modId)).then(function(res){

        // XXX
        // console.log('transport response', res);

        // TODO: Handle HTTP errors

        return res.response;
    });
};