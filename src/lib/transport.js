
var Promise = require('promise-polyfill');
var setAsap = require('setasap');
    Promise._setImmediateFn(setAsap);


var onload = {
    '200': function(){
        "use strict";

        // XXX
        console.log('<<< 200');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return [this.responseText];
        }
    },
    '304': function(){
        "use strict";

        // XXX
        console.log('<<< 304');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return this.responseText;
        }
    },
    '404': function(){
        "use strict";

        // XXX
        console.log('<<< 404: Not found!');

        try{
            return JSON.parse(this.responseText);
        }catch(e){
            return this.responseText;
        }
    }
};

var transport = {

    request: function(options){
        "use strict";

        return new Promise(function(resolve, reject){

            // XXX
            console.log('>>> New request promise');

            var _xhr    = new XMLHttpRequest();
            var _method = options.method || 'GET';
            var _url    = encodeURI(options.target);
            var _timer  = setTimeout(function(){
                reject(new Error('Estupendo ERROR: transport - Connection timeout'));
            }, options.timeout || 30 * 1000);

            // Open and setup the connection
            _xhr.open(_method, _url);

            // Prepare response
            _xhr.onload = function(){
                clearTimeout(_timer);

                console.log('>>> _xhr:', _xhr);

                if( !(_xhr.status in onload) ) {
                    var e = new Error('Estupendo ERROR: unknown status code');
                    return reject(e);
                }

                resolve(onload[_xhr.status].call(_xhr));
            };

            // Send the request
            _xhr.send();
        });
    }
};

module.exports = {
    request: transport.request,
    get: function(target, cb){
        "use strict";

        // XXX
        console.log('>>> Running GET for', target);

        return transport.request({
            method: 'GET',
            target: target
        }, cb);
    }
};