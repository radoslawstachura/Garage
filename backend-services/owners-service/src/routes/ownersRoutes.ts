import { Router } from "express";

import {
    getOwners,
    getOwnerById,
    getOwnerCars,
    createOwner,
    updateOwner,
    deleteOwner
} from "../controllers/ownersController";

const router = Router();

router.get("/", getOwners);
router.get("/:id", getOwnerById);
router.get("/:id/cars", getOwnerCars)
router.post("/", createOwner);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);

export default router;