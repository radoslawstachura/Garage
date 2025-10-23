import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";

import { jwtConfig } from "../config/jwt";
import { AppError } from "../types/AppError";
import { redisBlacklistClient, connectBlacklistRedis } from "../config/redis";

dotenv.config();

export interface JwtPayload {
    userId: string;
    type: string;
    jti: string;
    exp: number;
}

export class JwtUtil {
    // static generateToken(payload: Record<string, any>): string {
    //     return jwt.sign(
    //         { ...payload, jti: uuidv4() },
    //         jwtConfig.secret,
    //         { expiresIn: jwtConfig.expiresIn }
    //     );
    // }

    static async verifyToken(req: Request) {
        try {
            if (!(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")))
                throw new AppError("Unauthorized", 401);

            const token = req.headers.authorization.split(" ")[1];

            const decodedData = jwt.verify(token, jwtConfig.secret) as JwtPayload;

            if (!decodedData.jti || !decodedData.exp)
                throw new AppError("Invalid token payload", 401);

            await connectBlacklistRedis();

            const isBlacklisted = await redisBlacklistClient.exists(`bl:token:${decodedData.jti}`);

            if (isBlacklisted)
                throw new AppError("Token revoked", 401);

            return decodedData;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new AppError("Token expired", 401);
            } else if (error instanceof NotBeforeError) {
                throw new AppError("Token is not active", 401);
            } else if (error instanceof JsonWebTokenError) {
                throw new AppError("Invalid token", 401);
            } else {
                throw error;
            }
        }
    }

    // static async revokeToken(payload: JwtPayload) {
    //     const { jti, exp } = payload;

    //     const ttl = exp - Math.floor(Date.now() / 1000);

    //     if (ttl > 0) {
    //         await connectRedis();
    //         await redisClient.setEx(`bl:token:${jti}`, ttl, "1");
    //     }
    // }
};