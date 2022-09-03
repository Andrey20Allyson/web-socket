const { createServer } = require('web-socket-lib/http-server');

const server = createServer();

server.setRootDir('../public');

server.start((port, hostname) => {
    console.log('> [Server] listening http://%s:%s', hostname, port);
});