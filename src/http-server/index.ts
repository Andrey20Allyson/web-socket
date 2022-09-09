import http, { IncomingMessage } from 'http';
import { createRequestCacher, RequestCacherI } from './server-cache';

type Methods = 'GET' | 'POST' | 'PUT' | 'CONNECT' | 'HEAD' | 'DELETE' | 'TRACE' | 'OPTIONS';
type ServerOnStartListener = (port: number, hostname: string) => void;

export interface IServer {
    start(onStart?: ServerOnStartListener, port?: number, hostname?: string): void;
    setRootDir(newRoot: string): void;
    sendData(path: string, res: http.ServerResponse): void;
    addRequestListener(method: Methods, listener: http.RequestListener): number;
};

export interface IRequestListeners {
    [k: string]: http.RequestListener[];
};

export class HTTPServer implements IServer {
    private static defaultOnStart(port: number, hostname: string): void {
        console.log('> [Server] Listening http://%s:%s', hostname, port);
    }

    private __listeners: IRequestListeners;

    private __server: http.Server;
    private __cacher: RequestCacherI;
    private __rootDir: string;
    
    constructor(requestListener?: http.RequestListener, cacher: RequestCacherI = createRequestCacher()) {
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

        this.__server = http.createServer(
            requestListener ??
            ((req, res) => this.defaultRequestListener(req, res))
        );

        this.__cacher = cacher;
        this.__rootDir = '.'
    }

    start(onStart?: ServerOnStartListener, port: number = 80, hostname: string = 'localhost'): void {
        this.__server.listen(
            port,
            hostname,
            () => (onStart ?? HTTPServer.defaultOnStart)(port, hostname)
        );
    }

    setRootDir(newRoot: string): void {
        this.__rootDir = newRoot;
    }

    sendData(path: string, res: http.ServerResponse<http.IncomingMessage>): void {
        this.__cacher.getDataFrom(this.__rootDir + path)
        .then((data) => {
            res.writeHead(200, {'Content-type': 'text/html'});
            res.write(data);
        })
        .catch((reason: NodeJS.ErrnoException) => {
            console.log(reason);
            res.writeHead(404, {'Content-type': 'text/html'});
            res.write(`Error: ${reason.message}`);
        })
        .finally(() => {
            res.end();
        });
    }

    addRequestListener(method: Methods, listener: http.RequestListener): number {
        if (method in this.__listeners)
            return this.__listeners[method].push(listener);
        
        return 0;
    }

    private defaultRequestListener(req: http.IncomingMessage, res: http.ServerResponse): void {
        for (let listener of this.__listeners[req.method ?? 'GET'] ?? []) {
            listener(req, res);
            if (!res.writable) return;
        }

        if (req.method === 'GET') {
            if (req.url === '/' || !req.url) {
                this.sendData('/index.html', res);
            } else {
                this.sendData(req.url, res);
            }
        }
    }
};

export abstract class ServerCreater {
    public static createServer(requestListener?: http.RequestListener): IServer {
        const requestCacher = createRequestCacher();
        const server = new HTTPServer(requestListener, requestCacher);
        
        return server;
    }
};

export default ServerCreater;