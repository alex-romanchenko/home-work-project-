export interface NewsPost {
  id: number;
  title: string;
  text: string;
  createDate: string;
}

// тип для створення новини
export type NewsPostCreateData = Omit<NewsPost, "id" | "createDate">;

// тип для оновлення
export type NewsPostUpdateData = Partial<Omit<NewsPost, "id">>;