
var status = require('./status');

module.exports = {
    sync: function(target){
        "use strict";

        var _xhr    = new XMLHttpRequest();
        var _method = 'GET';
        var _url    = encodeURI('modules/' + target + '/index.js');
        var _async  = false;

        // Open sync connection
        _xhr.open(_method, _url, _async);
        _xhr.send(null);

        // Known status code?
        if( !(_xhr.status in status) )
            throw new Error('Estupendo ERROR: unknown status code');


        // Handle response
        return status[_xhr.status].call(_xhr);
    },
    
    async: function(modId){
        "use strict";
        
        
    }
};