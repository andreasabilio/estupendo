
module.exports = function(modId, modSrc){
    "use strict";

    // Wrap module
    var wrapped = "window.estupendo.run('"
        + modId
        + "',"
        + "function*(module, exports){\n"
        + modSrc.split('require(').join('yield require(')
        + "\n// Return to estupendo"
        + "\nreturn module.exports || exports;\n});";


    // Nodes
    var scriptNode = document.createElement("script");
    var headNode   = document.querySelector('head');

    // Node settings
    scriptNode.id        = modId;
    scriptNode.innerHTML = wrapped;
    scriptNode.type      = "text\/javascript";

    // Insert into DOM and thereby run
    headNode.appendChild(scriptNode);
};