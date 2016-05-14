

var riww   = require('./riww');
// var status = require('./status');


var transport = module.exports = {

    // Sync loading strategy
    sync: function(msg){
        "use strict";

        // Setup
        // var _config = window.estupendo.config;
        var _xhr    = new XMLHttpRequest();
        var _method = 'GET';
        var _target = msg.data.modulesUrl + msg.data.modId + '/index.js';
        var _url    = encodeURI(_target);
        var _async  = false;

        // XXX
        // console.log('>>>', _url);

        // Open sync connection
        _xhr.open(_method, _url, _async);
        _xhr.send(null);

        // TODO: Handle HTTP errors

        try{
            result = JSON.parse(_xhr.responseText);
        }catch(e){
            result = [_xhr.responseText];
        }
    },

    // Async loading strategy
    async: function(modId){
        "use strict";
        
        return riww(transport.sync.toString(), {
            modulesUrl: window.estupendo.config.modulesUrl,
            modId:      modId
        });
    }
};