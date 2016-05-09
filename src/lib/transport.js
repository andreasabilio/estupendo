
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

module.exports = {
    get: function(target){
        "use strict";

        var _xhr    = new XMLHttpRequest();
        var _method = 'GET';
        var _url    = encodeURI(target);
        var _async  = false;

        // Open sync connection
        _xhr.open(_method, _url, _async);
        _xhr.send(null);

        // Known status code?
        if( !(_xhr.status in onload) )
            throw new Error('Estupendo ERROR: unknown status code');


        // Handle response
        return onload[_xhr.status].call(_xhr);
    }
};