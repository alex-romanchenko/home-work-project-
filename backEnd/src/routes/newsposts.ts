import { Router, Request, Response, NextFunction } from "express";
import { NewspostsService } from "../services/NewspostsService";
import type { NewsPostCreateData, NewsPostUpdateData } from "../types/NewsPost";

const router = Router();
const newspostsService = new NewspostsService();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page ?? 0);
        const size = Number(req.query.size ?? 10);

        const newsposts = newspostsService.getAll({
            page: Number.isNaN(page) ? 0 : page,
            size: Number.isNaN(size) ? 10 : size,
        });

        res.json(newsposts);
    } catch (error) {
        next(error);
    }
});

router.get("/error", (req: Request, res: Response, next: NextFunction) => {
    try {
        newspostsService.throwError();
    } catch (error) {
        next(error);
    }
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            res.status(404).json({ error: "News post not found" });
            return;
        }

        const newspost = newspostsService.getById(id);

        if (!newspost) {
            res.status(404).json({ error: "News post not found" });
            return;
        }

        res.json(newspost);
    } catch (error) {
        next(error);
    }
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: NewsPostCreateData = {
            title: req.body.title,
            text: req.body.text,
            genre: req.body.genre,
            isPrivate: req.body.isPrivate,
        };

        const createdNewspost = newspostsService.create(data);

        res.json(createdNewspost);
    } catch (error) {
        next(error);
    }
});

router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            res.status(404).json({ error: "News post not found" });
            return;
        }

        const updateData: NewsPostUpdateData = {};

        if (req.body.title !== undefined) {
            updateData.title = req.body.title;
        }

        if (req.body.text !== undefined) {
            updateData.text = req.body.text;
        }

        if (req.body.genre !== undefined) {
            updateData.genre = req.body.genre;
        }

        if (req.body.isPrivate !== undefined) {
            updateData.isPrivate = req.body.isPrivate;
        }

        const updatedNewspost = newspostsService.update(id, updateData);

        if (!updatedNewspost) {
            res.status(404).json({ error: "News post not found" });
            return;
        }

        res.json(updatedNewspost);
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            res.status(404).json({ error: "News post not found" });
            return;
        }

        const deletedId = newspostsService.delete(id);

        if (deletedId === null) {
            res.status(404).json({ error: "News post not found" });
            return;
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

export default router;