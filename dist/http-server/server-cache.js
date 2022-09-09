"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestCacher = exports.RequestCache = exports.RequestCacher = void 0;
const fs_1 = __importDefault(require("fs"));
;
class RequestCacher {
    caches = [];
    constructor(e) {
    }
}
exports.RequestCacher = RequestCacher;
;
class RequestCache {
    data;
    path;
    constructor(data, path) {
        this.data = data;
        this.path = path;
    }
    updateData(err, data) {
    }
}
exports.RequestCache = RequestCache;
;
function createRequestCacher() {
    const caches = [];
    let maxLen = 8;
    const cacher = {
        getDataFrom(path) {
            return new Promise((resolve, reject) => {
                let data = caches.find(v => v.path === path)?.data;
                if (data)
                    resolve(data);
                fs_1.default.readFile(path, { encoding: 'utf-8' }, (err, data) => {
                    if (err)
                        reject(err);
                    this.insert(data, path);
                    resolve(data);
                });
            });
        },
        insert(data, path) {
            if (caches.length >= maxLen)
                caches.shift();
            caches.push(new RequestCache(data, path));
        },
        setMaxLen(newLen) {
            if (newLen < 0)
                throw new Error('newLen must be positive!');
            if (newLen < maxLen)
                caches.splice(0, maxLen - newLen);
            maxLen = newLen;
        }
    };
    return cacher;
}
exports.createRequestCacher = createRequestCacher;
