import { Router } from "express";

import { createUser, changePassword, login, logout, refreshAccessToken, getUsers } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/password", changePassword);
router.post("/refresh", refreshAccessToken);

export default router;