import { Router } from "express";

import {
    getCars,
    getCarById,
    getCarRepairs,
    createCar,
    updateCar,
    deleteCar
} from "../controllers/carsController";

const router = Router();

router.get("/", getCars);
router.get("/:id", getCarById);
router.get("/:id/repairs", getCarRepairs);
router.post("/", createCar);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

export default router;