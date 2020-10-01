import * as webSocket from "ws";
import { IRooms } from '../interfaces/IRooms';
import * as roomCatalog from './RoomsCatalog';
import { ISenderOptions } from "../interfaces/ISenderOptions";
import { get } from "../controllers/SenderController";
import { Redis } from "./Redis";
import { env } from "../environment";
import { Statistic } from "./Statistic";

const redisClient = Redis.getInstance();
const apm = Statistic.getInstance();

export class Rooms {
    rooms: IRooms[];
    private lastUpdateDay: number;

    constructor(CLIENTS: any[]) {
        this.rooms = roomCatalog.loadRooms();
        this.lastUpdateDay = (new Date()).getDate();
        this.open(CLIENTS);
        this.reloadingRooms(CLIENTS);
    }

    private checkInRoom(CLIENTS: any[], roomName: string): any[] {
        return CLIENTS.filter(function (client: any) {
            if (client.data !== undefined) {
                return client.data.rooms.indexOf(roomName) > -1;
            }
            return false;
        });
    }

    private close() {
        for (let room of this.rooms) {
            clearInterval(room.interval!);
        }
        console.log('The rooms were close!');
    }

    private open(CLIENTS: any[]) {
        let self = this;
        for (let room of this.rooms) {
            if (room.name == 'qiwiPayments') console.log(room);
            room.interval = setInterval(function check() {
                let inRoom = self.checkInRoom(CLIENTS, room.name);
                if (inRoom.length > 0) {
                    apm.startTransaction(room.name);
                    apm.setLabel('users', inRoom.length);
                    let options: ISenderOptions = {
                        apiUtl: room.url,
                        returnObj: room.name,
                        token: room.token
                    };
                    let getData = get(options);
                    getData.then(function (result: any) {
                        if (Redis.checkRedisConnection(redisClient)) {
                            redisClient.set(env.NODE_ENV + '_' +
                                room.name, JSON.stringify(JSON.parse(result)), 'EX', Redis.CACHE_DURATION,
                                (err: Error|null, _reply: any) => {
                                    if (err) console.error(err);
                                });
                        }
                        console.log(room.name + ': ' + inRoom.length);
                        inRoom.forEach(function each(client) {
                            if (client.readyState === webSocket.OPEN) {
                                client.send(result);
                            }
                        });
                    }).catch(function (error) {
                        console.error(error);
                        apm.captureError(JSON.parse(error.response.body));
                    });
                    apm.endTransaction();
                }
            }, room.timer);
        }

        console.log('The rooms were open!');
    }

    reloadingRooms(CLIENTS: any[]) {
        let self = this;
        setInterval(function reload() {
            if (self.lastUpdateDay != (new Date()).getDate()) {
                console.log('Start reloading rooms...');
                self.close();
                self.rooms = roomCatalog.loadRooms();
                self.lastUpdateDay = (new Date()).getDate();
                self.open(CLIENTS);
            }
        }, 1000 * 60);
    }

    getDataFromCache(client: any) {
        if (Redis.checkRedisConnection(redisClient)) {
            this.rooms.forEach(value => {
                if (client.data.rooms.indexOf(value.name) > -1) {
                    redisClient.get(env.NODE_ENV + '_' + value.name, function (_err: any, data: string) {
                        console.log(`${value.name} from cache`);
                        if (client.readyState === webSocket.OPEN) {
                            client.send(data);
                        }
                    });
                }
            });
        }
    }
}
