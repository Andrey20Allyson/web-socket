"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerCreater = exports.HTTPServer = void 0;
const events_1 = __importDefault(require("events"));
const http_1 = __importDefault(require("http"));
const server_cache_1 = require("./server-cache");
;
;
class HTTPServer extends events_1.default {
    static defaultOnStart(port, hostname) {
        console.log('> [Server] Listening http://%s:%s', hostname, port);
    }
    __server;
    __cacher;
    __rootDir;
    __acceptedMethods;
    constructor(requestListener, cacher = (0, server_cache_1.createRequestCacher)()) {
        super({
            captureRejections: true
        });
        this.__acceptedMethods = [
            'get',
            'put',
            'post',
            'trace',
            'connect',
            'delete',
            'options',
            'head'
        ];
        this.__server = http_1.default.createServer(requestListener ??
            this.defaultRequestListener.bind(this));
        this.__cacher = cacher;
        this.__rootDir = '.';
    }
    start(onStart, port = 80, hostname = 'localhost') {
        let startListener = onStart ?? HTTPServer.defaultOnStart;
        this.__server.listen(port, hostname, () => startListener(port, hostname));
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
    on(eventName, listener) {
        return super.on(eventName, listener);
    }
    emit(eventName, ...args) {
        return super.emit(eventName, ...args);
    }
    defaultRequestListener(req, res) {
        let { method } = req;
        if (!method)
            return;
        method = method.toLowerCase();
        if (this.__acceptedMethods.includes(method)) {
            this.emit(method, req, res);
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
