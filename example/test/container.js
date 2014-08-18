module.exports = function(container) {
    "use strict";
    container.add('protocol', 'http');
    container.add('host', 'localhost');
    container.add('port', 1337);
    container.add('rootPath', '');
};