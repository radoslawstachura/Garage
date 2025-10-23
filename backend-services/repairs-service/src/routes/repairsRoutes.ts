import { Router } from "express";

import {
    getRepairs,
    getRepairById,
    // getIncome,
    // getRepairsPerMonth,
    createRepair,
    updateRepair
} from "../controllers/repairsController";

const router = Router();

router.get("/", getRepairs);
router.get("/:id", getRepairById);
// router.get("/stats/income", getIncome);
// router.get("/stats/repairs", getRepairsPerMonth);
router.post("/", createRepair);
router.put("/:id", updateRepair);

export default router;