export type NewsGenre = "Politic" | "Business" | "Sport" | "Other";

export interface NewsPost {
    id: number;
    title: string;
    text: string;
    genre: NewsGenre;
    isPrivate: boolean;
    createDate: string;
}

export type NewsPostCreateData = Omit<NewsPost, "id" | "createDate">;

export type NewsPostUpdateData = Partial<Omit<NewsPost, "id" | "createDate">>;

export type PaginationParams = {
    page: number;
    size: number;
};