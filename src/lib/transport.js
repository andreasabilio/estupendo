

var riww   = require('./riww');
var status = require('./status');


var transport = module.exports = {

    // Sync loading strategy
    sync: function(modId){
        "use strict";

        // Setup request
        var _xhr    = new XMLHttpRequest();
        var _method = 'GET';
        var _url    = encodeURI('http://localhost:3000/modules/' + modId + '/index.js');
        var _async  = false;

        // Open sync connection
        _xhr.open(_method, _url, _async);
        _xhr.send(null);

        try{
            return JSON.parse(_xhr.responseText);
        }catch(e){
            return [_xhr.responseText];
        }

        // Known status code?
        // if( !(_xhr.status in status) )
        //     throw new Error('Estupendo ERROR: unknown status code');
        //
        //
        // // Handle response
        // return status[_xhr.status].call(_xhr);
    },

    // Async loading strategy
    async: function(modId){
        "use strict";
        
        return riww(transport.sync.toString(), modId);
    }
};