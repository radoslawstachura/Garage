import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const DEFAULT_EXPIRATION: number = 600; // 10 minutes

export const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
            if (retries > 3) return new Error("Redis: Too many entries");
            return Math.min(retries * 100, 3000);
        }
    }
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

export const redisBlacklistClient = createClient({
    socket: {
        host: process.env.REDIS_BLACKLIST_HOST,
        port: Number(process.env.REDIS_BLACKLIST_PORT),
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
            if (retries > 3) return new Error("Redis-blacklist: Too many entries");
            return Math.min(retries * 100, 3000);
        }
    }
});

redisBlacklistClient.on("error", (err) => console.error("Redis Blacklist Client Error", err));

export const connectBlacklistRedis = async () => {
    if (!redisBlacklistClient.isOpen) {
        await redisBlacklistClient.connect();
    }
}