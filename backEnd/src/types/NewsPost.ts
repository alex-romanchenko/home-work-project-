export interface NewsPost {
    id: number;
    header: string;
    text: string;
    deleted: boolean;
    author: {
        id: number;
        email: string;
    };
}

export type NewsPostCreateData = {
    header: string;
    text: string;
};

export type NewsPostUpdateData = {
    header?: string;
    text?: string;
};

export type PaginationParams = {
    page: number;
    size: number;
};