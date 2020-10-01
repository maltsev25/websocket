import { IRooms } from "../interfaces/IRooms";
import { env } from "../environment";
import { formatEfDate, formatDate } from "../helpers/helper";

export const loadRooms = (): IRooms[] => {
    return [
        {
            name: 'roomName',
            url: env.API_SERVER + '/url/rout',  //example
            token: env.API_ACCESS_TOKEN,
            timer: 3000,
        },
    ];
};
