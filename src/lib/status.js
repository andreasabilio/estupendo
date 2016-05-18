
var status = module.exports = {
    '200': function(res){
        return status.parse(res);
    },
    '404': function(res){
        "use strict";
        // XXX
        console.log('<<< 404: Not found!');

        throw new Error('Estupendo ERROR: Module could not be found');

    },

    parse: function(res){
        try{
            return JSON.parse(res);
        }catch(e){
            return res;
        }
    }
};