import EventEmitter from "events";
import ServerCreater from "../http-server";
import { Socket } from "./socket";

export class SocketServer extends EventEmitter {
    private numberOfInsertedSockets: number;
    private sockets: Socket[];

    constructor() {
        super({
            captureRejections: true
        });

        this.numberOfInsertedSockets = 0;
        this.sockets = [];
    }

    insertSocket(socket: Socket) {
        this.sockets.push(socket)
        this.numberOfInsertedSockets++
    }

    on(eventName: 'connection', listener: (socket: Socket) => void): this;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    emit(eventName: 'connection', ...args: any[]): boolean;
    emit(eventName: string | symbol, ...args: any[]): boolean {
        return false;
    }
}

export abstract class SocketCreater {
    static createServer() {
        const server = new SocketServer();

        return server;
    }
}
