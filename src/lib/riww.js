
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

    // XXX
    // console.log('WORKER starting');

    // Define scoped modId
    var result = null;


    /*@@@*/


    // XXX
    // console.log('WORKER result:', result);

    // Return module source
    postMessage(result);

    // XXX
    // console.log('WORKER closing');

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
    // workerSrc.push("var co = ");
    // workerSrc.push(co.toString());
    // workerSrc.push(";\n(");
    workerSrc.push("(");
    workerSrc.push(wrapSrc[0]);
    workerSrc.push("\nresult = (");
    workerSrc.push(fnSrc);
    workerSrc.push(")(");
    workerSrc.push(_args);
    workerSrc.push(");\n");
    workerSrc.push(wrapSrc[1]);
    workerSrc.push(")();");

    // var workerSrc =
    //     + "var co = "
    //     + co.toString()
    //     + ";\n("
    //     + wrapSrc[0]
    //     + '\nresult = ('
    //     + fnSrc
    //     + ')('
    //     + args
    //     + ');\n'
    //     + wrapSrc[1]
    //     + ")();";

    // XXX
    // console.log('>>> workerSrc:', workerSrc.join(''));

    return workerSrc.join('');
};


module.exports = function(){
    "use strict";

    // XXX
    // console.log('RIWW arguments', arguments);

    // Parse options
    var timeout = 7000;
    var params  = Array.prototype.slice.call(arguments);
    var fnSrc   = params.splice(0, 1);
    var args    = params.map(function(arg){
        return '"' + arg + '"';
    }).join(', ');

    // // Wrap the function
    // var workerSrc = [];
    // var wrapSrc   = wrapOnMessage.toString().split('/*@@@*/');
    //
    // // Build the worker source
    // workerSrc.push("// Estupendo Web Worker\n");
    // // workerSrc.push("var co = ");
    // workerSrc.push(co.toString());
    // workerSrc.push(";\n(");
    // workerSrc.push(wrapSrc[0]);
    // workerSrc.push("\nresult = (");
    // workerSrc.push(fnSrc);
    // workerSrc.push(")(");
    // workerSrc.push(args);
    // workerSrc.push(");\n");
    // workerSrc.push(wrapSrc[1]);
    // workerSrc.push(")();");
    //
    // // var workerSrc =
    // //     + "var co = "
    // //     + co.toString()
    // //     + ";\n("
    // //     + wrapSrc[0]
    // //     + '\nresult = ('
    // //     + fnSrc
    // //     + ')('
    // //     + args
    // //     + ');\n'
    // //     + wrapSrc[1]
    // //     + ")();";
    //
    // // XXX
    // // console.log('>>> workerSrc:', workerSrc.join(''));


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