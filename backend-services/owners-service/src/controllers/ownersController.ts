import { Request, Response, NextFunction } from "express";
import axios from "axios";

import { CacheUtil } from "../utils/CacheUtil";
import { pool } from "../config/db";
import { Owner } from "../types/Owner";
import { CreateOwnerBody, CreateOwnerBodySchema, GetOwnerByIdParams, GetOwnerByIdParamsSchema, GetOwnersCarsParams, GetOwnersCarsParamsSchema, UpdateOwnerBody, UpdateOwnerBodySchema, UpdateOwnerParams, UpdateOwnerParamsSchema } from "../schemas/owners";
import { AppError } from "../types/AppError";
import { connectRedis, redisClient } from "../config/redis";

export const getOwners = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const owners = await CacheUtil.getOrSetCache<Owner[]>(
            "owners:all",
            async () => {
                const result = await pool.query(`
                    SELECT * FROM owners;
                `);

                return result.rows;
            },
            60
        );

        res.json(owners);
    } catch (error) {
        next(error);
    }
};

export const getOwnerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: GetOwnerByIdParams = GetOwnerByIdParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const result = await pool.query(`
            SELECT * FROM owners
            WHERE owner_id = $1;
        `, [id]);

        if (!result.rowCount) {
            throw new AppError(`Owner with id: ${id} not found`, 404);
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const getOwnerCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: GetOwnersCarsParams = GetOwnersCarsParamsSchema.parse(req.params);

        const { id } = parsedParams;

        let result = await pool.query(`
                SELECT COUNT(*) FROM owners
                WHERE owner_id = $1;    
                `, [id]);

        if (!Number(result.rows[0].count))
            throw new AppError(`Owner with id: ${id} not found`, 404);

        // fetch cars from cars-service

        const response = await axios.get(`http://reverse-proxy/cars?owner_id=${id}`);

        // result = await pool.query(`
        //             SELECT * FROM cars
        //             WHERE owner_id = $1;
        //         `, [id]);

        // const cars = result.rows;

        res.json(response.data);
    } catch (error) {
        next(error);
    }
};

export const createOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedBody: CreateOwnerBody = CreateOwnerBodySchema.parse(req.body);

        const { firstname, lastname, email = "", phone_number, address = "" } = parsedBody;

        let errorMessage = "";

        if (email) {
            let queryResult = await pool.query(`
                SELECT COUNT(*) FROM owners
                WHERE email LIKE $1;    
            `, [email]);

            if (Number(queryResult.rows[0].count))
                errorMessage += `Owner with email: ${email} already exists, `;
        }

        let queryResult = await pool.query(`
            SELECT COUNT(*) FROM owners
            WHERE phone_number LIKE $1;    
        `, [phone_number]);

        if (Number(queryResult.rows[0].count))
            errorMessage += `Owner with phone number: ${phone_number} already exists`;

        if (errorMessage)
            return res.status(409).json({
                status: 409,
                message: "Conflict: owner with provided email or phone number already exists"
            });

        const valuesForQuery = [
            firstname,
            lastname,
            email,
            phone_number,
            address
        ];

        const result = await pool.query(`
            INSERT INTO owners (firstname, lastname, email, phone_number, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;    
        `, valuesForQuery);

        await connectRedis();

        await redisClient.del("owners:all");

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

export const updateOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedParams: UpdateOwnerParams = UpdateOwnerParamsSchema.parse(req.params);

        const { id } = parsedParams;

        const check = await pool.query(`
            SELECT COUNT(*) FROM owners
            WHERE owner_id = $1;    
        `, [id]);

        if (!Number(check.rows[0].count))
            throw new AppError(`Owner with id: ${id} not found`, 404);

        const parsedBody: UpdateOwnerBody = UpdateOwnerBodySchema.parse(req.body);

        const { firstname, lastname, email = "", phone_number, address = "" } = parsedBody;

        const valuesForQuery = [
            firstname,
            lastname,
            email,
            phone_number,
            address
        ];

        const result = await pool.query(`
            UPDATE owners SET
                firstname=$1,
                lastname=$2,
                email=$3,
                phone_number=$4,
                address=$5
            WHERE owner_id=$6
            RETURNING *;    
        `, [...valuesForQuery, id]);

        await connectRedis();

        await redisClient.del("owners:all");

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};