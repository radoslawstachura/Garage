import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import carsRoutes from "./routes/carsRoutes";

import { errorHandler } from "./middleware/errorHandler";
import { AppError } from "./types/AppError";
import { startConsumer } from "./kafka/consumer";

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

// === ROUTES ===
app.use("/cars", carsRoutes);
// === ROUTES ===

// === HEALTH ===
app.get("/health", (req: Request, res: Response) => {
    res.json("up");
});
// === HEALTH ===

// === 404 ===
app.all("*", (req, res, next) => {
    next(new AppError(`${req.originalUrl} not found`, 404));
});
// === 404 ===

// === ERROR HANDLING ===
app.use(errorHandler);
// === ERROR HANDLING ===

async function start() {
    try {
        await startConsumer();
        console.log("Kafka consumer ready");

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Kafka consumer:", error);
        process.exit(1);
    }
}

start();