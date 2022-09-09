"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstExternalAddress = void 0;
const os_1 = __importDefault(require("os"));
function getFirstExternalAddress() {
    let interfaces = Object.values(os_1.default.networkInterfaces());
    let found = interfaces.find(v => {
        if (v === undefined)
            return false;
        return v[1].internal === false;
    });
    if (found === undefined)
        return;
    return found[1].address;
}
exports.getFirstExternalAddress = getFirstExternalAddress;
exports.default = { getFirstExternalAddress };
