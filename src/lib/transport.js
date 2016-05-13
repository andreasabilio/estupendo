

var riww   = require('./riww');
var status = require('./status');


var transport = module.exports = {

    // Sync loading strategy
    sync: function(modId){
        "use strict";

        // Prefer scoped modId
        // var __modId = _modId || modId;

        // Setup request
        var _xhr    = new XMLHttpRequest();
        var _method = 'GET';
        var _url    = encodeURI('http://localhost:3000/modules/' + modId + '/index.js');
        var _async  = false;

        // XXX
        // console.log('SYNC:', _url);

        // Open sync connection
        _xhr.open(_method, _url, _async);
        _xhr.send(null);
        
        // XXX
        // console.log('TRANSPORT Status:', _xhr.status);

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

        // // Prepare worker source
        // var timeout    = 7000;
        // var workerSrc  = "onmessage = " + workerFn.toString();
        // var workerBlob = buildBlob(workerSrc);
        //
        // // Return a promise
        // return new Promise(function(resolve, reject){
        //
        //     var worker = new Worker(window.URL.createObjectURL(workerBlob));
        //
        //     // Register message handler
        //     worker.onmessage = resolve;
        //
        //     // Supply params to worker
        //     worker.postMessage(modId);
        //
        //     // Setup timeout
        //     setTimeout(function(){worker.terminate();
        //         var error = new Error('Estupendo ERROR: Async request for '+modId+' timed out');
        //         worker.terminate();
        //         reject(error);
        //     }, timeout);
        // });
    }
};