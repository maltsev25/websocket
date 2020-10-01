import * as rp from 'request-promise';
import { ISenderOptions } from '../interfaces/ISenderOptions';

export const get = (options: ISenderOptions) => {
    return new Promise(function (resolve, reject) {
        rp.get({
            url: options.apiUtl,
            headers: {
                'Authorization': options.token,
                'Content-Type': 'application/json'
            }
        })
            .then(function (body) {
                if (options.returnObj) {
                    resolve('{"' + options.returnObj + '":' + body + '}');
                } else {
                    resolve(body);
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

export const post = (options: ISenderOptions) => {
    return new Promise(function (resolve, reject) {
        rp.post({
            url: options.apiUtl,
            headers: {
                'Authorization': options.token,
                'Content-Type': 'application/json'
            }
        })
            .then(function (body) {
                resolve(body);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};
