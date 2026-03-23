import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import type { LoginData, RegisterData } from "../types/User";

const router = Router();
const authService = new AuthService();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: RegisterData = {
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        };

        const result = authService.register(data);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: LoginData = {
            email: req.body.email,
            password: req.body.password,
        };

        const result = authService.login(data);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;