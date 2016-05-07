
var path       = require('path');
var express    = require('express');
var server     = express();
var routes     = require('./routes');
var logger     = require('./logger');


// Parse http body
// server.use(bodyParser.urlencoded({ extended: false }));
// server.use(bodyParser.json());


// Register www static dir
server.use('/modules', express.static(path.resolve(__dirname, '../node_modules')));
server.use('/*', express.static(path.resolve(__dirname, './www')));

// Register routes
// server.use(routes);


// Launch the server
server.listen(3000, function () {
    console.log('');
    console.log('> Server has started on port 3000');
    console.log('');
});