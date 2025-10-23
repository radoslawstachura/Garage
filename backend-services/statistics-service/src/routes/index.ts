import { Router } from "express";

import RepairsStatsRoutes from "./repairsStatsRoutes"
// import MechanicsStatsRoutes from "./mechanicsStatsRoutes"

const router = Router();

router.use("/repairs", RepairsStatsRoutes);
// router.use("/mechanics", MechanicsStatsRoutes);

export default router;