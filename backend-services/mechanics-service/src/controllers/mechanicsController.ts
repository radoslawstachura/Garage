import { Request, Response, NextFunction } from "express";
import axios from "axios";

import { CacheUtil } from "../utils/CacheUtil";
import { pool } from "../config/db";
import { Mechanic } from "../types/Mechanic";
import { CreateMechanicBody, CreateMechanicBodySchema, GetMechanicByIdParams, GetMechanicByIdParamsSchema, GetMechanicsRepairsParams, GetMechanicsRepairsParamsSchema, UpdateMechanicBody, UpdateMechanicBodySchema, UpdateMechanicParams, UpdateMechanicParamsSchema } from "../schemas/mechanics";
import { AppError } from "../types/AppError";
import { connectRedis, redisClient } from "../config/redis";

export const getMechanics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mechanics = await CacheUtil.getOrSetCache<Mechanic[]>(
            "mechanics:all",
            async () => {
                const result = await pool.query(`
                SELECT * FROM mechanics;
            `);

                return result.rows;
            },
            60
        );

        res.json(mechanics);
    } catch (error) {
        next(error);
    }
};

export const getMechanicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: GetMechanicByIdParams = GetMechanicByIdParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const result = await pool.query(`
            SELECT * FROM mechanics
            WHERE mechanic_id = $1;    
        `, [id]);

        if (!result.rowCount)
            throw new AppError(`Mechanic with id: ${id} not found`, 404);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const getMechanicRepairs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: GetMechanicsRepairsParams = GetMechanicsRepairsParamsSchema.parse(req.params);

        const { id } = parsedParams;

        let result = await pool.query(`
                    SELECT COUNT(*) FROM mechanics
                    WHERE mechanic_id = $1;    
                `, [id]);

        if (!Number(result.rows[0].count))
            throw new AppError(`Mechanic with id: ${id} not found`, 404);

        const response = await axios.get(`http://reverse-proxy/repairs?mechanic_id=${id}`);

        res.json(response.data);
    } catch (error) {
        next(error);
    }
};

export const createMechanic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody: CreateMechanicBody = CreateMechanicBodySchema.parse(req.body);

        const {
            firstname,
            lastname,
            specialization,
            phone_number,
            email
        } = parsedBody;

        const queryValues = [
            firstname,
            lastname,
            specialization,
            phone_number,
            email
        ];

        const result = await pool.query(`
            INSERT INTO mechanics (
                firstname,
                lastname,
                specialization,
                phone_number,
                email
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, queryValues);

        const atIndex = email.indexOf("@");

        const requestBody = {
            login: email.substring(0, atIndex),
            role: "mechanic"
        };

        await axios.post("http://reverse-proxy/user", requestBody);

        await connectRedis();

        await redisClient.del("mechanics:all");

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const updateMechanic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: UpdateMechanicParams = UpdateMechanicParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const check = await pool.query(`
            SELECT COUNT(*) FROM mechanics
            WHERE mechanic_id = $1;    
            `, [id]);

        if (!Number(check.rows[0].count))
            throw new AppError(`Mechanic with id: ${id} not found`, 404);

        const parsedBody: UpdateMechanicBody = UpdateMechanicBodySchema.parse(req.body);

        const {
            firstname,
            lastname,
            specialization,
            phone_number,
            email
        } = parsedBody;

        const queryValues = [
            firstname,
            lastname,
            specialization,
            phone_number,
            email
        ];

        const result = await pool.query(`
            UPDATE mechanics SET
            firstname=$1,
            lastname=$2,
            specialization=$3,
            phone_number=$4,
            email=$5
            WHERE mechanic_id=$6
            RETURNING *;    
        `, [...queryValues, id]);

        await connectRedis();

        await redisClient.del("mechanics:all");

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};