import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/AppError";
import { ZodError } from "zod";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction // unused parameter
) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            status: 400,
            message: "Invalid JSON format"
        });
    }

    if (err instanceof ZodError) {
        const message = "Invalid input data";

        return res.status(400).json({
            status: 400,
            message,
            errors: err.issues
        });
    }

    if (err instanceof AppError) {
        err.statusCode = err.statusCode || 500;

        if (process.env.NODE_ENV == 'development') {
            console.error("ERROR:", err);

            return res.status(err.statusCode).json({
                message: err.message,
                stack: err.stack,
                error: err
            });
        }

        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.statusCode,
                message: err.message
            });
        }
    }

    console.error(err);

    return res.status(500).json({
        status: 500,
        message: "Internal server error"
    });
};