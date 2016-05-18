
var errors  = require('./errors');


var status = module.exports = {
    '200': function(res){
        return status.parse(res);
    },
    '404': function(res){
        "use strict";

        console.error(errors.notFound, this.target);

    },

    parse: function(res){
        try{
            return JSON.parse(res);
        }catch(e){
            return res;
        }
    }
};