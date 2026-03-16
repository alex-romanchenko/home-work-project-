import { NewspostsRepository } from "../repositories/NewspostsRepository";
import type {
    NewsPost,
    NewsPostCreateData,
    NewsPostUpdateData,
    PaginationParams,
} from "../types/NewsPost";

export class NewspostsService {
    private readonly newspostsRepository: NewspostsRepository;

    constructor() {
        this.newspostsRepository = new NewspostsRepository();
    }

    public getAll(params: PaginationParams): NewsPost[] {
        return this.newspostsRepository.getAll(params);
    }

    public getById(id: number): NewsPost | null {
        return this.newspostsRepository.getById(id);
    }

    public create(data: NewsPostCreateData): NewsPost {
        return this.newspostsRepository.create(data);
    }

    public update(id: number, update: NewsPostUpdateData): NewsPost | null {
        return this.newspostsRepository.update(id, update);
    }

    public delete(id: number): number | null {
        return this.newspostsRepository.delete(id);
    }
}