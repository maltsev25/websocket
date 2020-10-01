import Timeout = NodeJS.Timeout;

export interface IRooms {
    name: string;
    url: string;
    token: string;
    timer: number;
    interval?: Timeout;
    lastReload?: string;
}
