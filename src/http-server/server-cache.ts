import fs from 'fs';

export interface RequestCacherI {
    getDataFrom(path: string): Promise<string>;
    insert(data: string, path: string): void;
    setMaxLen(newLen: number): void;
};

export class RequestCacher {
    private caches: RequestCache[] = [];

    constructor(e: string) {
        
    }
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

export function createRequestCacher() {
    const caches: RequestCache[] = [];
    let maxLen = 8;

    const cacher: RequestCacherI = {
        getDataFrom(path) {
            return new Promise((resolve, reject) => {
                let data = caches.find(v => v.path === path)?.data;
                if (data) resolve(data);

                fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
                    if (err) reject(err);

                    this.insert(data, path);

                    resolve(data);
                });
            });
        },

        insert(data, path) {
            if (caches.length >= maxLen) caches.shift();
            caches.push(new RequestCache(data, path));
        },

        setMaxLen(newLen) {
            if (newLen < 0) throw new Error('newLen must be positive!');

            if (newLen < maxLen) 
                caches.splice(0, maxLen - newLen);

            maxLen = newLen;
        }
    };

    return cacher;
}