import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler";
import { AppError } from "./types/AppError";
import statisticRoutes from "./routes/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// === CORS ===
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
}));
// === CORS ===

// === PARSERS ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// === PARSERS ===

// === ROUTERS ===
app.use("/statistics", statisticRoutes);
// === ROUTERS ===

// === 404 ===
app.all("*", (req, res, next) => {
    next(new AppError(`${req.originalUrl} not found`, 404));
});
// === 404 ===

// === ERROR HANDLING ===
app.use(errorHandler);
// === ERROR HANDLING ===

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
