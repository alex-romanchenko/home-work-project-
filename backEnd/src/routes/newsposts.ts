import { Router, Request, Response } from "express";
import { NewspostsService } from "../services/NewspostsService";
import type { NewsPostCreateData, NewsPostUpdateData } from "../types/NewsPost";

const router = Router();
const newspostsService = new NewspostsService();

router.get("/", (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page ?? 0);
        const size = Number(req.query.size ?? 10);

        const newsposts = newspostsService.getAll({
            page: Number.isNaN(page) ? 0 : page,
            size: Number.isNaN(size) ? 10 : size,
        });

        res.json(newsposts);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", (req: Request, res: Response) => {
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
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", (req: Request, res: Response) => {
    try {
        const data: NewsPostCreateData = {
            title: req.body.title,
            text: req.body.text,
        };

        const createdNewspost = newspostsService.create(data);

        res.json(createdNewspost);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/:id", (req: Request, res: Response) => {
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

        const updatedNewspost = newspostsService.update(id, updateData);

        if (!updatedNewspost) {
            res.status(404).json({ error: "News post not found" });
            return;
        }

        res.json(updatedNewspost);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", (req: Request, res: Response) => {
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
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;