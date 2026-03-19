import { NewspostsRepository } from "../repositories/NewspostsRepository";
import {
    validateNewspostCreate,
    validateNewspostUpdate,
} from "../validators/newspostValidator";
import { NewspostsServiceError } from "../errors/NewspostsServiceError";

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
        try {
            validateNewspostCreate(data);

            return this.newspostsRepository.create(data);
        } catch (error) {
            throw error; // ValidationError піде наверх
        }
    }

    public update(id: number, update: NewsPostUpdateData): NewsPost | null {
        try {
            validateNewspostUpdate(update);

            return this.newspostsRepository.update(id, update);
        } catch (error) {
            throw error;
        }
    }

    public delete(id: number): number | null {
        return this.newspostsRepository.delete(id);
    }

    // 🔥 спеціальний endpoint для тесту помилки
    public throwError(): never {
        throw new NewspostsServiceError("Test service error");
    }
}