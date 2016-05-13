

// XXX
// console.log('WORKER WINDOW:', window);
console.log('-- WORKER:', Worker);


// Register listener
onmessage = function(msg){
    "use strict";

    // XXX
    console.log('WORKER got message:', msg.data);

    // Return module source
    postMessage({
        fromWorker: true,
        wanted:     msg.data
    });

    // XXX
    console.log('WORKER closing now');

    // Terminate the worker
    close();
};