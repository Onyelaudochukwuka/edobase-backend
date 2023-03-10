#!/usr/bin/env node

/**
 * Module dependencies.
*/
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { ConnectOptions, connect, set } from "mongoose";
import  application  from "../app";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('EdoBase-backend:server');
import http from 'http';
import startSocket from "../socket";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwtSecret = process.env.JWT_SECRET ?? '';
if (!jwtSecret) throw new Error("Secret hash is missing");
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("uri missing");
}
/**
 * Get port from environment and store in Express.
*/

const port = normalizePort(process.env.PORT || '4000');
application.set('port', port);
const server = http.createServer(application);
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});
startSocket();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const statusMonitor = require('express-status-monitor')({
    websocket: io,
});
application.use(statusMonitor);
application.get('/', statusMonitor.pageRoute);

/**
 * Create HTTP server.
*/

// eslint-disable-next-line no-var
// eslint-disable-next-line @typescript-eslint/no-var-requires
const options: ConnectOptions = {};
set('strictQuery', true);
/**
 * Listen on provided port, on all network interfaces.
 */
connect(uri, options).then(() => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
});
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val:string):boolean | string |  number {
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

function onError(error: any): Error | void {
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

function onListening(): void {
    const addr = server.address();
    if(typeof addr === 'string'){
        console.log('\x1b[33m%s\x1b[0m','Server is running on port: ' + addr);
    }
    else{
        console.log('\x1b[33m%s\x1b[0m','Server is running on port: ' + addr?.port);
    }
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr?.port;
    debug('Listening on ' + bind);
}
