import EventEmitter from "events";
import ServerCreater from "../http-server";

export class SocketServer extends EventEmitter {
    constructor() {
        super({
            captureRejections: true
        });

        
    }

    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }

    emit(eventName: string | symbol, ...args: any[]): boolean {
        return false;
    }
}

export abstract class SocketCreater {
    static createServer() {

    }
}
