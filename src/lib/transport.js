

var riww   = require('./riww');
var status = require('./status')


var getModFile = function(config){
    "use strict";

    if(!config.loadPackage)
        return '/index.js';

    // TODO
    return false;
};


var buildUrl = function(target){
    "use strict";

    // XXX
    // console.log('CONFIG:', window.estupendo.config);
    
    // Parse defaults && policy
    var config = Object.assign({
        modules:    'node_modules',
        loadPackage: false
    }, window.estupendo.config, {
        root: window.location.href
    });

    // Setup
    var url    = [config.root];
    var prefix = target.substring(0,1);

    // console.log('Prefix:', prefix);

    // Build url
    switch(prefix){
        case '/':
            url.push(target.replace('/', ''));
            break;
        case './':
            url.push(target.replace('./', ''));
            break;
        default:
            url.push(config.modules.split('/').join('') + '/');
            url.push(target);
            url.push(getModFile(target));
    }

    return url.join('');

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
        // console.log('>>> url', url);

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

        // Convert sync() to string for execution in worker
        var fnSrc = transport.sync.toString();

        // Prepare sync() args to be passed inside the worker
        var args  = buildUrl(modId);

        // Run In Web Worker
        return riww(fnSrc, args).then(function(msg){

            // XXX
            // console.log('transport data', msg.data);

            // TODO: Handle HTTP errors

            return msg.data.response;
        });
    }
};