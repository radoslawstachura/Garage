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
                    WITH months AS (
                        SELECT
                            generate_series(
                                date_trunc('month', CURRENT_DATE) - INTERVAL '12 months',
                                date_trunc('month', CURRENT_DATE) - INTERVAL '1 month',
                                INTERVAL '1 month'
                            ) AS month_start
                    )
                    SELECT
                        EXTRACT(MONTH FROM m.month_start) AS month,
                        EXTRACT(YEAR FROM m.month_start) AS year,
                        COALESCE(SUM(r.cost), 0) AS "totalIncome"
                    FROM months m
                    LEFT JOIN repairs r
                        ON date_trunc('month', r.date) = m.month_start
                    GROUP BY m.month_start
                    ORDER BY m.month_start;
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
                    WITH months AS (
                        SELECT
                            generate_series(
                                date_trunc('month', CURRENT_DATE) - INTERVAL '12 months',
                                date_trunc('month', CURRENT_DATE) - INTERVAL '1 month',
                                INTERVAL '1 month'
                            ) AS month_start
                    )
                    SELECT
                        EXTRACT(MONTH FROM m.month_start) AS month,
                        EXTRACT(YEAR FROM m.month_start) AS year,
                        COALESCE(COUNT(repair_id), 0) AS "repair_count"
                    FROM months m
                    LEFT JOIN repairs r
                        ON date_trunc('month', r.date) = m.month_start
                    GROUP BY m.month_start
                    ORDER BY m.month_start;
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