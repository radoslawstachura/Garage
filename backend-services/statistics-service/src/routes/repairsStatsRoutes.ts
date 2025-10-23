import { Router } from "express";

import {
    getIncomeMonthly,
    getRepairsMonthly
} from "../controllers/repairsStatsController";

const router = Router();

router.get("/income/monthly", getIncomeMonthly);
router.get("/monthly", getRepairsMonthly);

export default router;