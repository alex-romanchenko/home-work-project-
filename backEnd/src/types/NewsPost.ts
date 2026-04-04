export interface NewsPost {
    id: number;
    title: string;
    text: string;
    author: {
        id: number;
        email: string;
        password: string;
    };
}

export type NewsPostCreateData = {
    title: string;
    text: string;
};

export type NewsPostUpdateData = {
    title?: string;
    text?: string;
};

export type PaginationParams = {
    page: number;
    size: number;
};