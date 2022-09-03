const { createServer } = require('web-socket-lib/http-server');
const {  } = require('web-socket-lib/http-web-socket');

const server = createServer();

server.setRootDir('../public');

server.start((port, hostname) => {
    console.log('> [Server] listening http://%s:%s', hostname, port);
});