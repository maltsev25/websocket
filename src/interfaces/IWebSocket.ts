import * as webSocket from "ws";

export interface IWebSocket extends webSocket {
    _socket: any;
    isAlive: boolean;
}