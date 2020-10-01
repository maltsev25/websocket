import redis = require('redis');
import { redisClientOptions } from '../environment';

export class Redis {
    static readonly AUTH_CACHE_DURATION = 60 * 60 * 12; // 12 hours
    static readonly CACHE_DURATION = 60 * 60 * 3; // 3 hour
    private static redisClient: redis.RedisClient;

    public static getInstance(): redis.RedisClient {
        if (this.redisClient == undefined) {
            this.redisClient = redis.createClient(redisClientOptions);
            this.redisClient.on("error", function (error) {
                console.error(error);
            });
        }
        return this.redisClient;
    }

    public static checkRedisConnection(redisClient: redis.RedisClient): boolean {
        // @ts-ignore
        return redisClient.ready;
    }
}
