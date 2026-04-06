import { AppDataSource } from "../data-source";
import { Newspost } from "../entities/Newspost";
import { User } from "../entities/User";
import type {
    NewsPostCreateData,
    NewsPostUpdateData,
    PaginationParams,
} from "../types/NewsPost";

export class NewspostsRepository {
    private readonly newspostRepository = AppDataSource.getRepository(Newspost);
    private readonly userRepository = AppDataSource.getRepository(User);

    public async getAll(params: PaginationParams): Promise<Newspost[]> {
        return this.newspostRepository.find({
            where: {
                deleted: false,
            },
            relations: ["author"],
            select: {
                id: true,
                header: true,
                text: true,
                deleted: false,
                author: {
                    id: true,
                    email: true,
                },
            },
            skip: params.page * params.size,
            take: params.size,
            order: {
                id: "ASC",
            },
        });
    }

    public async getById(id: number): Promise<Newspost | null> {
        return this.newspostRepository.findOne({
            where: { id, deleted: false },
            relations: ["author"],
            select: {
                id: true,
                header: true,
                text: true,
                deleted: false,
                author: {
                    id: true,
                    email: true,
                },
            },
        });
    }

    public async create(data: NewsPostCreateData, userId: number): Promise<Newspost | null> {
    const user = await this.userRepository.findOne({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("Author not found");
    }

    const newspost = this.newspostRepository.create({
        header: data.header,
        text: data.text,
        author: user,
    });

    const savedNewspost = await this.newspostRepository.save(newspost);

    return this.newspostRepository.findOne({
        where: { id: savedNewspost.id },
        relations: ["author"],
        select: {
            id: true,
            header: true,
            text: true,
            author: {
                id: true,
                email: true,
            },
        },
    });
}

public async update(id: number, update: NewsPostUpdateData): Promise<Newspost | null> {
    const newspost = await this.newspostRepository.findOne({
        where: { id, deleted: false},
        relations: ["author"],
    });

    if (!newspost) {
        return null;
    }

    if (update.header !== undefined) {
        newspost.header = update.header;
    }

    if (update.text !== undefined) {
        newspost.text = update.text;
    }

    await this.newspostRepository.save(newspost);

    return this.newspostRepository.findOne({
        where: { id },
        relations: ["author"],
        select: {
            id: true,
            header: true,
            text: true,
            author: {
                id: true,
                email: true,
            },
        },
    });
}

    public async delete(id: number): Promise<number | null> {
        const newspost = await this.newspostRepository.findOne({
            where: { id, deleted: false },
        });

        if (!newspost) {
            return null;
        }

        newspost.deleted = true;
        await this.newspostRepository.save(newspost);

        return id;
    }
}