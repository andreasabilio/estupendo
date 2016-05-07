
module.exports = function (req) {

    console.log('-----------------------------------');

    // Log requests
    console.log('TIMESTAMP:', Date.now());
    console.log('HEADERS > accept:', req.headers.accept);
    console.log('HEADERS > authorization:', req.headers.authorization);
    console.log('BODY:', req.body);
    console.log('URL:', req.url);
    console.log('METHOD:', req.method);

};