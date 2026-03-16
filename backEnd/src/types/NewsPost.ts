export interface NewsPost {
    id: number;
    title: string;
    text: string;
    createDate: string;
}

export type NewsPostCreateData = Omit<NewsPost, "id" | "createDate">;

export type NewsPostUpdateData = Partial<Omit<NewsPost, "id">>;

export type PaginationParams = {
    page: number;
    size: number;
};