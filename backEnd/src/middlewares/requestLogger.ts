import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body =
        req.body && Object.keys(req.body).length > 0
            ? JSON.stringify(req.body)
            : "no body";

    logger.info(`${req.method} ${req.originalUrl} - ${body}`);
    next();
};