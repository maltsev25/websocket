import * as http from 'http';
import * as https from 'https';
import * as webSocket from 'ws';
import { WebSocketServer } from './utils/WebSocketServer';
import { credentials } from "./controllers/CredentaleController";
import { env } from './environment';

let httpsServer = null;
if (env.NODE_ENV === 'development') {
    // @ts-ignore
    httpsServer = http.createServer(credentials);
} else {
    // @ts-ignore
    httpsServer = https.createServer(credentials);
}
httpsServer.listen(env.PORT);

const wss = new webSocket.Server({
    server: httpsServer
});

const webSocketServer = new WebSocketServer(wss);
if (webSocketServer.getState()) {
    console.log(`${env.NAME_IN_ELASTIC} server start ${env.PORT}`);
    webSocketServer.start();
} else {
    console.error(`Something went wrong!`);
}

