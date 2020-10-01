import apm = require('elastic-apm-node');
import { env } from '../environment';
import * as webSocket from "ws";

export class Statistic {
    private static agent: any;

    public static getInstance(): any {
        if (this.agent == undefined) {
            this.agent = apm.start({
                serviceName: env.NAME_IN_ELASTIC,
                secretToken: env.ELASTIC_TOKEN,
                serverUrl: env.ELASTIC_SERVER,
            });
        }
        return this.agent;
    }

    public static registerMetric(apm: any, wss: webSocket.Server) {
        apm.registerMetric('ws.connections', () => {
            return wss.clients.size;
        });
    }
}
