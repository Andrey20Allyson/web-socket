"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_server_1 = __importDefault(require("./http-server"));
const server = http_server_1.default.createServer();
const root = process.argv[2];
if (!root)
    throw new Error('Required Arg[2] - [root]');
server.setRootDir(process.argv[2]);
server.start();
