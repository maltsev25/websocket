import { ISenderOptions } from '../interfaces/ISenderOptions';
import { post } from "./SenderController";
import { env } from '../environment';
import { Redis } from '../utils/Redis';

const redisClient = Redis.getInstance();

export const checkAuthCache = (token: string): Promise<boolean> => {
    console.log('checkAuthCache');
    return new Promise(function (resolve, _reject) {
        if (Redis.checkRedisConnection(redisClient)) {
            redisClient.get(env.NODE_ENV + '_' + token, function (_err: any, data: string) {
                if (data === null) {
                    checkAuthRequest(token).then(function (result: any) {
                        resolve(result);
                    });
                } else {
                    console.log(JSON.parse(data));
                    resolve(true);
                }
            });
        } else {
            checkAuthRequest(token).then(function (result: any) {
                resolve(result);
            });
        }
    });
};

export const checkAuthRequest = (token: string): Promise<boolean> => {
    return new Promise(function (resolve, _reject) {
        console.log('checkToken request');
        let options: ISenderOptions = {apiUtl: env.API_CHECK_AUTH, token: token};
        let checkAuth = post(options);
        checkAuth.then(function (result: any) {
            if (JSON.parse(result).status === 200) {
                let data = JSON.parse(result).data;
                console.log(data);
                if (Redis.checkRedisConnection(redisClient)) {
                    redisClient.set(env.NODE_ENV + '_' +
                        token, JSON.stringify(data), 'EX', Redis.AUTH_CACHE_DURATION,
                        (error: Error|null, _reply: any) => {
                            if (error) {
                                console.error(error);
                            }
                        });
                }
                resolve(true);
            } else {
                console.error(JSON.parse(result));
                resolve(false);
            }
        }).catch(function (error) {
            console.error(error);
        });
    });
};
