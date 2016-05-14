

var riww        = require('./riww');
var status      = require('./status');


var buildTarget = function(modId){
    "use strict";

    // XXX
    // console.log('CONFIG:', window.estupendo.config);

    var config      = window.estupendo.config;
    var nodeModules = config.nodeModules.split('/').join('') + '/';
    var target      = [];

    target.push(config.rootUrl);
    target.push(nodeModules);
    target.push(modId);
    target.push('/index.js');

    return target.join('');

};


var transport = module.exports = {

    // Sync loading strategy
    sync: function(target){
        "use strict";

        // Setup
        var xhr    = new XMLHttpRequest();
        var method = 'GET';
        var url    = encodeURI(target);
        var async  = false;

        // XXX
        // console.log('>>>', url);

        // Open sync connection
        xhr.open(method, url, async);
        xhr.send(null);

        // XXX
        // console.log('transport xhr:', xhr.toString());

        return {
            status: xhr.status,
            response: xhr.responseText
        };
    },

    // Async loading strategy
    async: function(modId){
        "use strict";

        // XXX
        // console.log('window:', window);

        var fnSrc = transport.sync.toString();
        var args  = buildTarget.call(window.estupendo.config, modId);

        // Run In Web Worker
        return riww(fnSrc, args).then(function(msg){

            // XXX
            // console.log('transport data', msg.data);

            // TODO: Handle HTTP errors

            return msg.data.response;
        });
    }
};