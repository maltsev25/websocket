import * as webSocket from "ws";
import * as AuthController from '../controllers/AuthController';
import { IWebSocket } from '../interfaces/IWebSocket';
import { Rooms } from './Rooms';
import { Statistic } from "./Statistic";

export class WebSocketServer {
    private readonly wss: webSocket.Server;

    public getState() {
        return this.wss !== null;
    }

    constructor(wss: webSocket.Server) {
        this.wss = wss;
    }

    start() {
        let CLIENTS: any[] = [];

        const rooms = new Rooms(CLIENTS);

        function noop() {
        }

        function heartbeat(this: any): void {
            if (!this) return;
            this.isAlive = true;
        }

        setInterval(function ping() {
            CLIENTS.forEach(function each(ws) {
                if (ws.isAlive === false) {
                    removeClient(ws);
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping(noop);
            });
        }, 5000);

        function removeClient(ws: IWebSocket) {
            let index = CLIENTS.indexOf(ws);
            console.log('connection ' + index + ' close ' + ws._socket.remoteAddress + ":" + ws._socket.remotePort);
            if (index > -1) {
                CLIENTS.splice(index, 1);
            }
        }

        function setDataClient(ws: IWebSocket, data: object) {
            let index = CLIENTS.indexOf(ws);
            if (index > -1) {
                CLIENTS[index].data = data;
                rooms.getDataFromCache(CLIENTS[index]);
            }
        }

        this.wss.on('connection', function (ws: IWebSocket) {
            CLIENTS.push(ws);
            ws.isAlive = true;
            ws.on('pong', heartbeat);

            console.log("new connection " + ws._socket.remoteAddress + ":" + ws._socket.remotePort);
            ws.on('message', function incoming(data: string) {
                console.log("message " + ws._socket.remoteAddress + ":" + ws._socket.remotePort + " body: " + data);
                let jsonObj = JSON.parse(data);
                if (jsonObj.auth_token !== undefined) {
                    let authResult = AuthController.checkAuthCache(jsonObj.auth_token);
                    authResult.then(function (result: boolean) {
                        if (result) {
                            console.log('authorised');
                            setDataClient(ws, jsonObj);
                        }
                    });
                }
                CLIENTS.forEach(function each(client) {
                    if (client.readyState === webSocket.OPEN) {
                        client.send(data);
                    }
                });
            });

            ws.on('close', function () {
                removeClient(ws);
            });

        });

        Statistic.registerMetric(Statistic.getInstance(), this.wss);
    }
}
