
var status = module.exports = {
    '200': function(){
        "use strict";

        // XXX
        // console.log('<<< 200');

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