import { Request, Response, NextFunction } from "express";

import { HashUtil } from "../utils/HashUtil";
import { JwtUtil } from "../utils/JwtUtil";
import { AppError } from "../types/AppError";
import { changePasswordBody, changePasswordBodySchema, createUserBody, createUserBodySchema, loginBody, loginBodySchema } from "../schemas/user";
import { pool } from "../config/db";
import { updatePassword } from "../services/user";
import { RefreshTokenUtil } from "../utils/RefreshTokenUtil";
import { connectBlacklistRedis, redisBlacklistClient } from "../config/redis";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users;
        `);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody: createUserBody = createUserBodySchema.parse(req.body);

        const { login, role } = parsedBody;

        const result = await pool.query(`
            INSERT INTO users(login, password, has_logged_in, role)
            VALUES(
                $1,
                '$2b$12$RsgPthun3rPPvxYIRpL2t.yMs6TIbYj3odXIhIj3JccRYD4zjJiHW',
                false,
                $2
            ) RETURNING *;
        `, [login, role]);

        console.log("CREATED USER:", JSON.stringify(result.rows[0], null, 5));

        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody: loginBody = loginBodySchema.parse(req.body);

        const { login, password } = parsedBody;

        const queryResult = await pool.query(`
            SELECT * FROM users
            WHERE login = $1;
        `, [login]);

        if (!Number(queryResult.rowCount))
            throw new AppError("Invalid credentials", 401);

        const userObject = queryResult.rows[0];

        if (!(await HashUtil.comparePassword(password, userObject.password)))
            throw new AppError("Invalid credentials", 401);

        if (!userObject.has_logged_in) {
            const changePasswordToken = JwtUtil.generateToken({
                userId: userObject.user_id,
                type: "change-password"
            });

            return res.json({
                message: "Password change required",
                token: changePasswordToken
            });
        }

        const accessToken = JwtUtil.generateToken({
            userId: userObject.user_id,
            type: "access"
        });

        const refreshToken = RefreshTokenUtil.generate();
        const hashedRefreshToken = RefreshTokenUtil.hash(refreshToken);

        await connectBlacklistRedis();

        await redisBlacklistClient.setEx(
            `rt:${hashedRefreshToken}`,
            60 * 60 * 24 * 30,
            JSON.stringify({
                userId: userObject.user_id
            })
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30
        });

        const role = userObject.role;

        res.json({
            accessToken,
            login,
            role
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataFromToken = await JwtUtil.verifyToken(req);

        await JwtUtil.revokeToken(dataFromToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax"
        });

        res.sendStatus(204);
    } catch (error) {
        if (
            (error instanceof AppError && error.message == "Token expired") ||
            (error instanceof AppError && error.message == "Token revoked")
        ) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "lax"
            });

            return res.sendStatus(204);
        }

        next(error);
    } finally {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const hashedToken = RefreshTokenUtil.hash(refreshToken);

            try {
                await connectBlacklistRedis();
                await redisBlacklistClient.del(`rt:${hashedToken}`);
            } catch (error) {
                console.error("Failed to delete refresh token after logout from Redis:", error);
            }
        }
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody: changePasswordBody = changePasswordBodySchema.parse(req.body);

        const { oldPassword, newPassword, confirmPassword } = parsedBody;

        const dataFromToken = await JwtUtil.verifyToken(req);

        const { userId, type } = dataFromToken;

        await updatePassword(userId, oldPassword, newPassword, confirmPassword);

        if (type == "change-password")
            await JwtUtil.revokeToken(dataFromToken);

        res.status(200).json({ message: "Password changed successfully, please log in again" });
    } catch (error) {
        next(error);
    }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken)
            throw new AppError("No refresh token provided", 401);

        const hashedToken = RefreshTokenUtil.hash(refreshToken);

        await connectBlacklistRedis();

        const jsonFromRedis = await redisBlacklistClient.get(`rt:${hashedToken}`);

        if (!jsonFromRedis)
            throw new AppError("Invalid refresh token", 401);

        const record = JSON.parse(jsonFromRedis);

        const accessToken = JwtUtil.generateToken({
            userId: record.userId,
            type: "access"
        });

        await redisBlacklistClient.del(`rt:${hashedToken}`);

        const newRefreshToken = RefreshTokenUtil.generate();
        const newHashedRefreshToken = RefreshTokenUtil.hash(newRefreshToken);

        await redisBlacklistClient.setEx(
            `rt:${newHashedRefreshToken}`,
            60 * 60 * 24 * 30,
            JSON.stringify({
                userId: record.userId
            })
        );

        const queryResult = await pool.query(`
            SELECT * FROM users
            WHERE user_id = $1;    
        `, [record.userId]);

        if (!Number(queryResult.rowCount))
            throw new AppError("User not found", 404);

        const userObject = queryResult.rows[0];

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30
        });

        res.json({
            accessToken,
            login: userObject.login,
            role: userObject.role
        });
    } catch (error) {
        next(error);
    }
};