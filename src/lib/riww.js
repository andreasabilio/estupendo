
// CREDIT
// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string


// URL.createObjectURL
window.URL = window.URL || window.webkitURL;

// Dependencies
var co        = require('co');
var Promise   = require('promise-polyfill');
var setAsap   = require('setasap');
    Promise._setImmediateFn(setAsap);


var wrapOnMessage = function estupendoWrapper(){

    // Define scoped modId
    var result = null;


    /*@@@*/

    // Return module source
    postMessage(result);

    // Terminate the worker
    close();

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


var compileWorkerSrc = function(fnSrc, args){
    "use strict";

    // Setup
    var workerSrc = [];
    var wrapSrc   = wrapOnMessage.toString().split('/*@@@*/');
    var _args     = args.map(function(arg){
        return '"' + arg + '"';
    }).join(', ');

    // Build the worker source
    workerSrc.push("// Estupendo Web Worker\n");
    workerSrc.push("(");
    workerSrc.push(wrapSrc[0]);
    workerSrc.push("\nresult = (");
    workerSrc.push(fnSrc);
    workerSrc.push(")(");
    workerSrc.push(_args);
    workerSrc.push(");\n");
    workerSrc.push(wrapSrc[1]);
    workerSrc.push(")();");

    return workerSrc.join('');
};


module.exports = function(){
    "use strict";

    // Parse options
    var timeout = 7000;
    var params  = Array.prototype.slice.call(arguments);
    var fnSrc   = params.splice(0, 1);


    // Launch worker
    var workerSrc  = compileWorkerSrc(fnSrc, params);
    var workerBlob = buildBlob(workerSrc);
    var worker = new Worker(window.URL.createObjectURL(workerBlob));


    // Return a promise
    return new Promise(function(resolve, reject){

        // Register message handler
        worker.onmessage = resolve;

        // Setup timeout
        setTimeout(function(){
            var error = new Error('riwn ERROR: Async request worker timed out', arguments);
            worker.terminate();
            reject(error);
        }, timeout);
    });
};