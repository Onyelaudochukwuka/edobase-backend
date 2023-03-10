#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
/**
 * Module dependencies.
*/
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const mongoose_1 = require("mongoose");
const app_1 = __importDefault(require("../app"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('EdoBase-backend:server');
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("../socket"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwtSecret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '';
if (!jwtSecret)
    throw new Error("Secret hash is missing");
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("uri missing");
}
/**
 * Get port from environment and store in Express.
*/
const port = normalizePort(process.env.PORT || '4000');
app_1.default.set('port', port);
const server = http_1.default.createServer(app_1.default);
// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});
(0, socket_1.default)();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const statusMonitor = require('express-status-monitor')({
    websocket: exports.io,
});
app_1.default.use(statusMonitor);
app_1.default.get('/', statusMonitor.pageRoute);
/**
 * Create HTTP server.
*/
// eslint-disable-next-line no-var
// eslint-disable-next-line @typescript-eslint/no-var-requires
const options = {};
(0, mongoose_1.set)('strictQuery', true);
/**
 * Listen on provided port, on all network interfaces.
 */
(0, mongoose_1.connect)(uri, options).then(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
});
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    if (typeof addr === 'string') {
        console.log('\x1b[33m%s\x1b[0m', 'Server is running on port: ' + addr);
    }
    else {
        console.log('\x1b[33m%s\x1b[0m', 'Server is running on port: ' + (addr === null || addr === void 0 ? void 0 : addr.port));
    }
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + (addr === null || addr === void 0 ? void 0 : addr.port);
    debug('Listening on ' + bind);
}
