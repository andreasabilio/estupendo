

module.exports = function(asyncFn, args){
    "use strict";

    // XXX
    console.log('>>> Running syncker with (', args, ') ', asyncFn);

    // Prepare output
    var out = null;

    // Dead man switch
    // setTimeout(function(){
    //     throw new Error('Estupendo ERROR: Sincker timeout');
    // }, 5 * 1000);

    // Run the async function
    asyncFn(args, function(result){

        // XXX
        console.log('>>> Callback is called with (', args, '):', result.data || result);

        setTimeout(function(){
            out = result.data || result;
        }, 0);
    });

    // var pauser = function(){
    //     // setTimeout(function(){
    //         if( null === out)
    //             pauser();
    //     // }, 0);
    // };
    // pauser();

    // Wait for it...
    var waiter = true;
    while(waiter){
        // setTimeout(function(){
            // console.log('*******************');
            if(null !== out)
                waiter = false;
        // }, 0);
    }

    // XXX
    console.log('>>> Syncker done!');

    // Done
    return out;
};