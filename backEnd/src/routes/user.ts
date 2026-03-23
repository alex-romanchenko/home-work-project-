import { Router, Request, Response } from "express";
import passport from "../auth/passport";

const router = Router();

router.get(
    "/",
    passport.authenticate("bearer", { session: false }),
    (req: Request, res: Response) => {
        res.json(req.user);
    }
);

export default router;