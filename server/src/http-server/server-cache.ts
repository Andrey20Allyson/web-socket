import fs from 'fs';

export interface RequestCacherI {
    getDataFrom(path: string): Promise<string>;
    insert(data: string, path: string): void;
    setMaxLen(newLength: number): void;
};

export class RequestCache {
    data: string;
    path: string;

    constructor(data: string, path: string) {
        this.data = data;
        this.path = path;
    }

    updateData(err: NodeJS.ErrnoException, data: string) {
        
    }
};

export class RequestCacher implements RequestCacherI {
    private caches: RequestCache[];
    private maxLength: number;

    constructor() {
        this.caches = [];
        this.maxLength = 8;
    }

    getDataFrom(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let data = this.caches.find(v => v.path === path)?.data;
            if (data) resolve(data);

            fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
                if (err) reject(err);

                this.insert(data, path);

                resolve(data);
            });
        });
    }

    insert(data: string, path: string): void {
        if (this.caches.length >= this.maxLength) this.caches.shift();
        this.caches.push(new RequestCache(data, path));
    }

    setMaxLen(newLength: number): void {
        if (newLength < 0) throw new Error('newLen must be positive!');

        if (newLength < this.maxLength)
            this.caches.splice(0, this.maxLength - newLength);

        this.maxLength = newLength;
    }
};

export function createRequestCacher() {
    const cacher = new RequestCacher()

    return cacher;
}