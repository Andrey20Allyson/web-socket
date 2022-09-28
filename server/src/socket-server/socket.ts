import EventEmitter from "events";

export class Socket extends EventEmitter {
    id: string;

    constructor() {
        super()

        this.id = 'N/A';
    }
}