"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerCreater = exports.HTTPServer = void 0;
const http_1 = __importDefault(require("http"));
const server_cache_1 = require("./server-cache");
;
;
class HTTPServer {
    static defaultOnStart(port, hostname) {
        console.log('> [Server] Listening http://%s:%s', hostname, port);
    }
    __listeners;
    __server;
    __cacher;
    __rootDir;
    constructor(requestListener, cacher = (0, server_cache_1.createRequestCacher)()) {
        this.__listeners = {
            CONNECT: [],
            DELETE: [],
            GET: [],
            HEAD: [],
            OPTIONS: [],
            POST: [],
            PUT: [],
            TRACE: []
        };
        this.__server = http_1.default.createServer(requestListener ??
            ((req, res) => this.defaultRequestListener(req, res)));
        this.__cacher = cacher;
        this.__rootDir = '.';
    }
    start(onStart, port = 80, hostname = 'localhost') {
        this.__server.listen(port, hostname, () => (onStart ?? HTTPServer.defaultOnStart)(port, hostname));
    }
    setRootDir(newRoot) {
        this.__rootDir = newRoot;
    }
    sendData(path, res) {
        this.__cacher.getDataFrom(this.__rootDir + path)
            .then((data) => {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(data);
        })
            .catch((reason) => {
            console.log(reason);
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.write(`Error: ${reason.message}`);
        })
            .finally(() => {
            res.end();
        });
    }
    addRequestListener(method, listener) {
        if (method in this.__listeners)
            return this.__listeners[method].push(listener);
        return 0;
    }
    defaultRequestListener(req, res) {
        for (let listener of this.__listeners[req.method ?? 'GET'] ?? []) {
            listener(req, res);
            if (!res.writable)
                return;
        }
        if (req.method === 'GET') {
            if (req.url === '/' || !req.url) {
                this.sendData('/index.html', res);
            }
            else {
                this.sendData(req.url, res);
            }
        }
    }
}
exports.HTTPServer = HTTPServer;
;
class ServerCreater {
    static createServer(requestListener) {
        const requestCacher = (0, server_cache_1.createRequestCacher)();
        const server = new HTTPServer(requestListener, requestCacher);
        return server;
    }
}
exports.ServerCreater = ServerCreater;
;
exports.default = ServerCreater;
