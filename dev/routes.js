
var router = require('express').Router();
var logger = require('./logger');

// router.get('/books', function(req, res){
//     "use strict";
//
//     logger(req);
//
//     // Create dummy data set
//     var data = [];
//     for(var i=0; i<10; i++){
//         data[i] = {
//             title: 'Some Book Title '+i,
//             author: 'Some lady '+i,
//             genre: 'Some genre '+i
//         };
//     }
//
//     // Send json
//     res.json(data);
// });
//
// router.get('/api/auth/token', function(req, res){
//     "use strict";
//
//     // logger(req);
//
//     res.json({
//         token: '#oauth#token#' + Date.now(),
//         ttl:   15 // Seconds
//     });
// });

router.all('/*', function(req, res){
    "use strict";

    logger(req);

    // Send response
    res.json({logged: true, fromServer: true});
});



module.exports = router;
