
module.exports = {

    // Remove leading slash if present
    unSlash: function(string){
        "use strict";

        if( '/' === string[0] )
            string = string.substr(1);

        return string;
    }
};