
// CREDIT
// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string


// URL.createObjectURL
window.URL = window.URL || window.webkitURL;

// Dependencies
var co        = require('co');
var Promise   = require('promise-polyfill');
var setAsap   = require('setasap');
    Promise._setImmediateFn(setAsap);


var estupendoWrapper = function estupendoWrapper(){

    var result;

    // Define scoped modId
    onmessage = null;

    // Return module source
    postMessage(result);

    // Terminate the worker
    close();

    /* @@@ DO NOT REMOVE*/
};

var buildBlob = function(blob){
    "use strict";

    try {
        return new window.Blob([blob], {type: 'application/javascript'});
    } catch (e) {

        // Backwards-compatibility
        window.BlobBuilder = window.BlobBuilder
            || window.WebKitBlobBuilder
            || window.MozBlobBuilder;

        // Blob setup
        blob = new window.BlobBuilder();
        blob.append(response);
        blob = blob.getBlob();

        return blob;
    }
};


var buildWorkerSrc = function(fnSrc){
    "use strict";

    // Setup
    var workerSrc = [];
    var wrapSrc = estupendoWrapper.toString()
        .replace('onmessage = null;', 'onmessage = ' + fnSrc.slice(0, -1))
        .replace('/* @@@ DO NOT REMOVE*/', '};');

    workerSrc.push("// Estupendo Web Worker\n");
    workerSrc.push("(");
    workerSrc.push(wrapSrc);
    workerSrc.push(")();");

    return workerSrc.join('');
};


module.exports = function(fnSrc, params){
    "use strict";

    // Setup
    var timeout = 7000;


    // Launch worker
    var workerSrc  = buildWorkerSrc(fnSrc);
    var workerBlob = buildBlob(workerSrc);
    var worker = new Worker(window.URL.createObjectURL(workerBlob));


    // Return a promise
    return new Promise(function(resolve, reject){

        // Register message handler
        worker.onmessage = resolve;
        
        // SEnd params to worker
        worker.postMessage(params);

        // Setup timeout
        setTimeout(function(){
            var error = new Error('riwn ERROR: Async request worker timed out', arguments);
            worker.terminate();
            reject(error);
        }, timeout);
    });
};