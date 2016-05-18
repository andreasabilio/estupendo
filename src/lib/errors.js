
var errPrefix = 'Estupendo ERROR: ';

module.exports = {
    notFound:       errPrefix + 'Module could not be loaded:',
    requireExists:  errPrefix + 'window.require is already defined',
    xssForbidden:   errPrefix + 'Only same-origin requests are supported',
    noMain:         errPrefix + 'Package.json does not declare module main'
};