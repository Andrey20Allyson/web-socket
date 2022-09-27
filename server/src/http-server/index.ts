import EventEmitter from 'events';
import http, { IncomingMessage } from 'http';
import { createRequestCacher, RequestCacherI } from './server-cache';

type Methods = 'GET' | 'POST' | 'PUT' | 'CONNECT' | 'HEAD' | 'DELETE' | 'TRACE' | 'OPTIONS';
type ServerOnStartListener = (port: number, hostname: string) => void;

export interface IServer {
    start(onStart?: ServerOnStartListener, port?: number, hostname?: string): void;
    setRootDir(newRoot: string): void;
    sendData(path: string, res: http.ServerResponse): void;
};

export interface IRequestListeners {
    [k: string]: http.RequestListener[];
};

export class HTTPServer extends EventEmitter implements IServer {
    private static defaultOnStart(port: number, hostname: string): void {
        console.log('> [Server] Listening http://%s:%s', hostname, port);
    }

    private __server: http.Server;
    private __cacher: RequestCacherI;
    private __rootDir: string;
    private __acceptedMethods: string[];

    constructor(requestListener?: http.RequestListener, cacher: RequestCacherI = createRequestCacher()) {
        super({
            captureRejections: true
        })

        this.__acceptedMethods = [
            'get',
            'put',
            'post',
            'trace',
            'connect',
            'delete',
            'options',
            'head'
        ]

        this.__server = http.createServer(
            requestListener ??
            this.defaultRequestListener.bind(this)
        );

        this.__cacher = cacher;
        this.__rootDir = '.'
    }

    start(onStart?: ServerOnStartListener, port: number = 80, hostname: string = 'localhost'): void {
        let startListener = onStart ?? HTTPServer.defaultOnStart

        this.__server.listen(
            port,
            hostname,
            () => startListener(port, hostname)
        );
    }

    setRootDir(newRoot: string): void {
        this.__rootDir = newRoot;
    }

    sendData(path: string, res: http.ServerResponse<http.IncomingMessage>): void {
        this.__cacher.getDataFrom(this.__rootDir + path)
            .then((data) => {
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.write(data);

            })
            .catch((reason: NodeJS.ErrnoException) => {
                console.log(reason);
                res.writeHead(404, { 'Content-type': 'text/html' });
                res.write(`Error: ${reason.message}`);

            })
            .finally(() => {
                res.end();
                
            });
    }

    on(eventName: 'get', listener: http.RequestListener): this;
    on(eventName: 'put', listener: http.RequestListener): this;
    on(eventName: 'post', listener: http.RequestListener): this;
    on(eventName: 'delete', listener: http.RequestListener): this;
    on(eventName: 'head', listener: http.RequestListener): this;
    on(eventName: 'trace', listener: http.RequestListener): this;
    on(eventName: 'connect', listener: http.RequestListener): this;
    on(eventName: 'options', listener: http.RequestListener): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(eventName, listener);
    }

    emit(eventName: 'get', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: 'put', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: 'post', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: 'delete', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: 'head', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: 'trace', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: 'connect', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: 'options', req: http.IncomingMessage, res: http.ServerResponse): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean {
        return super.emit(eventName, ...args);
    }

    private defaultRequestListener(req: http.IncomingMessage, res: http.ServerResponse): void {
        let { method, url } = req;
        if (!method) return;

        method = method.toLowerCase();

        if (this.__acceptedMethods.includes(method)) 
            this.emit(method, req, res);
        
        if (req.method === 'GET') {
            if (req.url === '/' || !url) {
                this.sendData('/index.html', res);
            } else {
                this.sendData(url, res);
            }
        }
    }
};

export abstract class ServerCreater {
    static createServer(requestListener?: http.RequestListener): IServer {
        const requestCacher = createRequestCacher();
        const server = new HTTPServer(requestListener, requestCacher);

        return server;
    }
};

export default ServerCreater;