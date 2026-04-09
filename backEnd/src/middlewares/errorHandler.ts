import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError";
import { NewspostsServiceError } from "../errors/NewspostsServiceError";
import { logger } from "../logger";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    void _next;
    void req;

    if (error instanceof ValidationError) {
        logger.warn(`${error.message}. Details: ${error.details.join(", ")}`);
        res.status(400).json({
            error: error.message,
            details: error.details,
        });
        return;
    }

    if (error instanceof NewspostsServiceError) {
        logger.error(error.stack || error.message);
        res.status(500).json({
            error: error.message,
        });
        return;
    }

    logger.error(error.stack || error.message);
    res.status(500).json({
        error: "Internal server error",
    });
};