import { Request, Response, NextFunction } from "express";
import axios from "axios";

import { CacheUtil } from "../utils/CacheUtil";
import { Car } from "../types/Car";
import { pool } from "../config/db";
import {
    CreateCarBody,
    CreateCarBodySchema,
    GetCarQuery,
    GetCarQuerySchema,
    GetCarByIdParams,
    GetCarByIdParamsSchema,
    GetCarsRepairsParams,
    GetCarsRepairsParamsSchema,
    UpdateCarBody,
    UpdateCarBodySchema,
    UpdateCarParams,
    UpdateCarParamsSchema,
    DeleteCarParams,
    DeleteCarParamsSchema
} from "../schemas/cars";
import { AppError } from "../types/AppError";
import { connectRedis, redisClient } from "../config/redis";

export const getCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedQuery: GetCarQuery = GetCarQuerySchema.parse(req.query);

        const { owner_id, vin, r_number } = parsedQuery;

        if (owner_id || vin || r_number) {

            let car;

            if (owner_id) {
                const result = await pool.query(`
                        SELECT * FROM cars
                        WHERE owner_id = $1;
                    `, [owner_id]);

                // if (!result.rowCount)
                //     throw new AppError(`Car with vin : ${vin} not found`, 404);

                car = result.rows;
            } else if (vin) {
                const result = await pool.query(`
                        SELECT * FROM cars
                        WHERE vin = $1;
                    `, [vin]);

                if (!result.rowCount)
                    throw new AppError(`Car with vin : ${vin} not found`, 404);

                car = result.rows[0];
            } else {
                const result = await pool.query(`
                        SELECT * FROM cars
                        WHERE registration_number = $1;
                    `, [r_number]);

                if (!result.rowCount)
                    throw new AppError(`Car with registration number: ${r_number} not found`, 404);

                car = result.rows[0];
            }

            return res.json(car);
        }

        const cars = await CacheUtil.getOrSetCache<Car[]>(
            "cars:all",
            async () => {
                const result = await pool.query(`
                    SELECT * FROM cars
                `);

                return result.rows;
            },
            60
        );

        res.json(cars);
    } catch (error) {
        next(error);
    }
};

export const getCarById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: GetCarByIdParams = GetCarByIdParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const result = await pool.query(`
            SELECT * FROM cars
            WHERE car_id = $1; 
        `, [id]);

        if (!result.rowCount)
            throw new AppError(`Car with id: ${id} not found`, 404);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const getCarRepairs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: GetCarsRepairsParams = GetCarsRepairsParamsSchema.parse(req.params);

        const { id } = parsedParams;

        let result = await pool.query(`
                    SELECT COUNT(*) FROM cars
                    WHERE car_id = $1;    
                `, [id]);

        if (!Number(result.rows[0].count))
            throw new AppError(`Car with id: ${id} not found`, 404);

        const response = await axios.get(`http://reverse-proxy/repairs?car_id=${id}`);

        res.json(response.data);
    } catch (error) {
        next(error);
    }
};

export const createCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody: CreateCarBody = CreateCarBodySchema.parse(req.body);

        const {
            registration_number,
            brand,
            model,
            production_year,
            mileage,
            owner_id,
            vin = ""
        } = parsedBody;

        const valuesForQuery = [
            registration_number,
            brand,
            model,
            production_year,
            mileage,
            owner_id,
            vin
        ];

        try {
            const responseFromOwners = await axios.get(`http://reverse-proxy/owners/${owner_id}`);
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
            INSERT INTO cars (
                registration_number,
                brand,
                model,
                production_year,
                mileage,
                owner_id,
                vin
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, valuesForQuery);

        await connectRedis();

        await redisClient.del("cars:all");

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const updateCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: UpdateCarParams = UpdateCarParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const check = await pool.query(`
            SELECT COUNT(*) FROM cars
            WHERE car_id = $1;  
        `, [id]);

        if (!Number(check.rows[0].count))
            throw new AppError(`Car with id: ${id} not found`, 404);

        const parsedBody: UpdateCarBody = UpdateCarBodySchema.parse(req.body);

        const {
            registration_number,
            brand,
            model,
            production_year,
            mileage,
            owner_id,
            vin = ""
        } = parsedBody;

        const valuesForQuery = [
            registration_number,
            brand,
            model,
            production_year,
            mileage,
            owner_id,
            vin
        ];

        const result = await pool.query(`
            UPDATE cars SET
                registration_number=$1,
                brand=$2,
                model=$3,
                production_year=$4,
                mileage=$5,
                owner_id=$6,
                vin=$7
            WHERE car_id=$8
            RETURNING *;
        `, [...valuesForQuery, id]);

        await connectRedis();

        await redisClient.del("cars:all");

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: DeleteCarParams = DeleteCarParamsSchema.parse(req.params);

        const { id } = parsedParams;

        await pool.query(`
            UPDATE cars SET
            is_deleted = TRUE,
            deleted_at = NOW()
            WHERE car_id = $1 AND is_deleted = FALSE;   
        `, [id]);

        await connectRedis();

        await redisClient.del("cars:all");

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}