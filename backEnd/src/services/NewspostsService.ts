import { NewspostsRepository } from "../repositories/NewspostsRepository";
import {
    validateNewspostCreate,
    validateNewspostUpdate,
} from "../validators/newspostValidator";
import { NewspostsServiceError } from "../errors/NewspostsServiceError";

import type {
    NewsPostCreateData,
    NewsPostUpdateData,
    PaginationParams,
} from "../types/NewsPost";
import { Newspost } from "../entities/Newspost";

export class NewspostsService {
    private readonly newspostsRepository: NewspostsRepository;

    constructor() {
        this.newspostsRepository = new NewspostsRepository();
    }

    public async getAll(params: PaginationParams): Promise<Newspost[]> {
        return this.newspostsRepository.getAll(params);
    }

    public async getById(id: number): Promise<Newspost | null> {
        return this.newspostsRepository.getById(id);
    }

    public async create(data: NewsPostCreateData, userId: number): Promise<Newspost | null> {
        validateNewspostCreate(data);

        return this.newspostsRepository.create(data, userId);
    }

    public async update(id: number, update: NewsPostUpdateData): Promise<Newspost | null> {
        validateNewspostUpdate(update);

        return this.newspostsRepository.update(id, update);
    }

    public async delete(id: number): Promise<number | null> {
        return this.newspostsRepository.delete(id);
    }

    public throwError(): never {
        throw new NewspostsServiceError("Test service error");
    }
}