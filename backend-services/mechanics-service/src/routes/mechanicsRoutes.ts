import { Router } from "express";

import {
    getMechanics,
    getMechanicById,
    getMechanicRepairs,
    createMechanic,
    updateMechanic
} from "../controllers/mechanicsController";

const router = Router();

router.get("/", getMechanics);
router.get("/:id", getMechanicById);
router.get("/:id/repairs", getMechanicRepairs);
router.post("/", createMechanic);
router.put("/:id", updateMechanic);

export default router;