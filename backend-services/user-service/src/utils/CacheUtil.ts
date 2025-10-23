import { redisClient, connectRedis, DEFAULT_EXPIRATION } from "../config/redis";

export class CacheUtil {
    static async getOrSetCache<T>(
        key: string,
        callback: () => Promise<T>,
        ttl: number = DEFAULT_EXPIRATION
    ): Promise<T> {
        try {
            await connectRedis();

            const cached = await redisClient.get(key);

            if (cached) {
                console.log("Cached for: ", key);
                return JSON.parse(cached) as T;
            }
        } catch (error) {
            console.warn(`Redis error (key ${key}): `, error);
        }

        const freshData = await callback();

        try {
            await redisClient.setEx(key, ttl, JSON.stringify(freshData));
            console.log("Not cached for: ", key);
        } catch (error) {
            console.warn(`Redis SET failed (key: ${key})`, error);
        }

        return freshData;
    }
};