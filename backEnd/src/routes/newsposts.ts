import { Router, Request, Response } from "express";
import { FileDB } from "../FileDB";
import type {
    NewsPost,
    NewsPostCreateData,
    NewsPostUpdateData,
} from "../types/NewsPost";

const router = Router();

const fileDB = new FileDB("./db.json");

const newsPostSchema = {
    id: Number,
    title: String,
    text: String,
    createDate: String,
};

fileDB.registerSchema("newspost", newsPostSchema);

const newsPostTable = fileDB.getTable<
    NewsPost,
    NewsPostCreateData,
    NewsPostUpdateData
>("newspost");

router.get("/", (req: Request, res: Response) => {
    try {
        const newsposts = newsPostTable.getAll();
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

        const newspost = newsPostTable.getById(id);

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

        const createdNewspost = newsPostTable.create(data);

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

        const patch: NewsPostUpdateData = {};

        if (req.body.title !== undefined) {
            patch.title = req.body.title;
        }

        if (req.body.text !== undefined) {
            patch.text = req.body.text;
        }

        const updatedNewspost = newsPostTable.update(id, patch);

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

        const deletedId = newsPostTable.delete(id);

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