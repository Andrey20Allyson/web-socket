import httpServer from './http-server';

const server = httpServer.createServer();

const root = process.argv[2];
if (!root) throw new Error('Required Arg[2] - [root]')

server.setRootDir(process.argv[2]);

server.start();