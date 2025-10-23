// import { NextFunction, Request, Response } from "express";

// import { mechanicsPool } from "../config/db";

// import { CacheUtil } from "../utils/CacheUtil";

// import { RepairsPerMechanicData } from "../types/RepairsPerMechanicData";

// export const getRepairCountPerMechanic = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await CacheUtil.getOrSetCache<RepairsPerMechanicData[]>(
//             "mechanics:repair-count",
//             async () => {
//                 const result = await mechanicsPool.query(`
//                     SELECT
//                         EXTRACT(MONTH FROM date) as month,
//                         EXTRACT(YEAR FROm date) as year,
//                         COUNT(repair_id) as repair_count
//                     FROM repairs
//                     WHERE date >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
//                     GROUP BY month, year
//                     ORDER BY year, month;
//                 `);

//                 res.json(result.rows);

//                 return result.rows;
//             },
//             60
//         );

//         res.json(data);
//     } catch (error) {
//         next(error);
//     }
// };