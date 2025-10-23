import { Request, Response, NextFunction } from "express";
import axios from "axios";

import { pool } from "../config/db";
import { CacheUtil } from "../utils/CacheUtil";
import { Repair } from "../types/Repair";
import {
    CreateRepairBody,
    CreateRepairBodySchema,
    GetRepairByIdParams,
    GetRepairByIdParamsSchema,
    GetRepairQuery,
    GetRepairQuerySchema,
    UpdateRepairBody,
    UpdateRepairBodySchema,
    UpdateRepairParams,
    UpdateRepairParamsSchema
} from "../schemas/repairs";
import { AppError } from "../types/AppError";
import { redisClient, connectRedis } from "../config/redis";
import { JwtUtil } from "../utils/JwtUtil";

export const getRepairs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const dataFromToken = await JwtUtil.verifyToken(req);

        // const { type } = dataFromToken;

        // if (!(type == "access"))
        //     throw new AppError("Invalid token type", 401);

        const parsedQuery: GetRepairQuery = GetRepairQuerySchema.parse(req.query);

        const { car_id, mechanic_id } = parsedQuery;

        if (car_id) {
            const result = await pool.query(`
                SELECT * FROM repairs
                WHERE car_id = $1;
            `, [car_id]);

            return res.json(result.rows);
        } else if (mechanic_id) {
            const result = await pool.query(`
                SELECT * FROM repairs
                WHERE mechanic_id = $1;
            `, [mechanic_id]);

            return res.json(result.rows);
        }

        const repairs = await CacheUtil.getOrSetCache<Repair[]>(
            "repairs:all",
            async () => {
                const result = await pool.query(`
                    SELECT * FROM repairs;    
                `);

                return result.rows;
            },
            60
        );

        res.json(repairs);
    } catch (error) {
        next(error);
    }
};

export const getRepairById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: GetRepairByIdParams = GetRepairByIdParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const result = await pool.query(`
            SELECT * FROM repairs
            WHERE repair_id = $1;    
        `, [id]);

        if (!result.rowCount)
            throw new AppError(`Repair with id: ${id} not found`, 404);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// export const getIncome = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const result = await pool.query(`
//             SELECT
//                 EXTRACT(MONTH FROM date) as month,
//                 EXTRACT(YEAR FROM date) as year,
//                 SUM(cost) as totalIncome
//             FROM repairs
//             WHERE date >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
//             GROUP BY month, year
//             ORDER BY year, month;
//         `);

//         res.json(result.rows);
//     } catch (error) {
//         next(error);
//     }
// };

// export const getRepairsPerMonth = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const result = await pool.query(`
//             SELECT
//                 EXTRACT(MONTH FROM date) as month,
//                 EXTRACT(YEAR FROm date) as year,
//                 COUNT(repair_id) as repair_count
//             FROM repairs
//             WHERE date >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
//             GROUP BY month, year
//             ORDER BY year, month;    
//         `);

//         res.json(result.rows);
//     } catch (error) {
//         next(error);
//     }
// };

export const createRepair = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody: CreateRepairBody = CreateRepairBodySchema.parse(req.body);

        const {
            car_id,
            mechanic_id,
            date,
            time,
            description,
            estimated_work_time,
            cost,
            work_time,
            status
        } = parsedBody;

        const queryValues = [
            car_id,
            mechanic_id,
            date,
            time,
            description,
            estimated_work_time,
            cost,
            work_time,
            status
        ];

        try {
            const responseFromCars = await axios.get(`http://reverse-proxy/cars/${car_id}`);
        } catch (err: any) {
            if (err.response) {
                throw new AppError(err.response.data.message, err.response.status);
            } else if (err.request) {
                throw new AppError('Service unavailable', 503);
            } else {
                throw err;
            }
        }

        try {
            const responseFromMechanics = await axios.get(`http://reverse-proxy/mechanics/${mechanic_id}`);
        } catch (err: any) {
            if (err.response) {
                throw new AppError(err.response.data.message, err.response.status);
            } else if (err.request) {
                throw new AppError('Service unavailable', 503);
            } else {
                throw err;
            }
        }

        const result = await pool.query(`
            INSERT INTO repairs (
                car_id,
                mechanic_id,
                date,
                time,
                description,
                estimated_work_time,
                cost,
                work_time,
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;    
        `, queryValues);

        await connectRedis();

        await redisClient.del("repairs:all");

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const updateRepair = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: UpdateRepairParams = UpdateRepairParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const check = await pool.query(`
            SELECT COUNT(*) FROM repairs
            WHERE repair_id = $1;    
        `, [id]);

        if (!Number(check.rows[0].count))
            throw new AppError(`Repair with id: ${id} not found`, 404);

        const parsedBody: UpdateRepairBody = UpdateRepairBodySchema.parse(req.body);

        const {
            car_id,
            mechanic_id,
            date,
            time,
            description,
            estimated_work_time,
            cost,
            work_time,
            status
        } = parsedBody;

        const queryValues = [
            car_id,
            mechanic_id,
            date,
            time,
            description,
            estimated_work_time,
            cost,
            work_time,
            status
        ];

        const result = await pool.query(`
            UPDATE repairs SET
                car_id=$1,
                mechanic_id=$2,
                date=$3,
                time=$4,
                description=$5,
                estimated_work_time=$6,
                cost=$7,
                work_time=$8,
                status=$9
            WHERE repair_id = $10
            RETURNING *;
        `, [...queryValues, id]);

        await connectRedis();

        await redisClient.del("repairs:all");

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};