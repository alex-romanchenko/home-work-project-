import { FileDB } from "../FileDB";
import type {
    NewsPost,
    NewsPostCreateData,
    NewsPostUpdateData,
    PaginationParams,
} from "../types/NewsPost";

export class NewspostsRepository {
    private readonly newsPostTable;

    constructor() {
        const fileDB = new FileDB("./db.json");

        const newsPostSchema = {
            id: Number,
            title: String,
            text: String,
            createDate: String,
        };

        fileDB.registerSchema("newspost", newsPostSchema);

        this.newsPostTable = fileDB.getTable<
            NewsPost,
            NewsPostCreateData,
            NewsPostUpdateData
        >("newspost");
    }

    public getAll(params: PaginationParams): NewsPost[] {
        const allNews = this.newsPostTable.getAll();

        const start = params.page * params.size;
        const end = start + params.size;

        return allNews.slice(start, end);
    }

    public getById(id: number): NewsPost | null {
        return this.newsPostTable.getById(id);
    }

    public create(data: NewsPostCreateData): NewsPost {
        return this.newsPostTable.create(data);
    }

    public update(id: number, update: NewsPostUpdateData): NewsPost | null {
        return this.newsPostTable.update(id, update);
    }

    public delete(id: number): number | null {
        return this.newsPostTable.delete(id);
    }
}