import { NextFunction, Request, Response } from "express";

import { repairsPool } from "../config/db";

import { CacheUtil } from "../utils/CacheUtil";

import { IncomeMonthlyData } from "../types/IncomeMonthlyData";
import { RepairsPerMonth } from "../types/RepairsPerMonthData";

export const getIncomeMonthly = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await CacheUtil.getOrSetCache<IncomeMonthlyData[]>(
            "income:monthly",
            async () => {
                const result = await repairsPool.query(`
                    SELECT
                        EXTRACT(MONTH FROM date) as month,
                        EXTRACT(YEAR FROM date) as year,
                        SUM(cost) as "totalIncome"
                    FROM repairs
                    WHERE date >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
                    GROUP BY month, year
                    ORDER BY year, month;
                `);

                return result.rows;
            },
            60
        );

        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getRepairsMonthly = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await CacheUtil.getOrSetCache<RepairsPerMonth[]>(
            "repairs:monthly",
            async () => {
                const result = await repairsPool.query(`
                    SELECT
                        EXTRACT(MONTH FROM date) as month,
                        EXTRACT(YEAR FROm date) as year,
                        COUNT(repair_id) as repair_count
                    FROM repairs
                    WHERE date >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
                    GROUP BY month, year
                    ORDER BY year, month;
                `);

                return result.rows;
            },
            60
        );

        res.json(data);
    } catch (error) {
        next(error);
    }
};