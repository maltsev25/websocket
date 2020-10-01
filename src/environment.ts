import * as dotEnv from 'dotenv';
import { ClientOpts } from 'redis';

dotEnv.config();

const getRedisPort = (): number => {
    let port = process.env.REDIS_PORT || '6379';
    return parseInt(port);
};

interface Environment {
    NODE_ENV: string;
    PORT: number|string;
    MEMCACHED_SERVER: string;
    NAME_IN_ELASTIC: string;
    ELASTIC_SERVER: string;
    ELASTIC_TOKEN: string;
    API_CHECK_AUTH: string;
    API_SERVER: string;
    API_ACCESS_TOKEN: string;
}

export const env: Environment = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    NAME_IN_ELASTIC: process.env.NAME_IN_ELASTIC || 'WebSocket',
    MEMCACHED_SERVER: process.env.MEMCACHED_SERVER || '127.0.0.1:11211',
    ELASTIC_TOKEN: process.env.ELASTIC_TOKEN || '',
    ELASTIC_SERVER: process.env.ELASTIC_SERVER || '',
    API_CHECK_AUTH: process.env.API_CHECK_AUTH || '',
    API_SERVER: process.env.API_SERVER || '',
    API_ACCESS_TOKEN: process.env.API_ACCESS_TOKEN || '',
};

export const redisClientOptions: ClientOpts = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: getRedisPort(),
    password: process.env.REDIS_PASSWORD || '',
    retry_strategy: function (options) {
        if (options.error && (options.error.code === 'ECONNREFUSED' || options.error.code === 'NR_CLOSED')) {
            // Try reconnecting after 5 seconds
            console.error('The server refused the connection. Retrying connection...');
            return 5000;
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            console.error(new Error("Retry time exhausted"));
            return 1000 * 60 * 60;
        }
        if (options.attempt > 50) {
            console.error(new Error("undefined"));
            return 1000 * 60 * 30;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    },
};
