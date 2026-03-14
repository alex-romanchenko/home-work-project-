export interface Entity {
    id: number;
}

export class Table<T extends Entity, CreateData, UpdateData> {
    private readonly tableName: string;
    private readonly read: () => Record<string, T[]>;
    private readonly write: (db: Record<string, T[]>) => void;

    constructor(
        tableName: string,
        read: () => Record<string, T[]>,
        write: (db: Record<string, T[]>) => void
    ) {
        this.tableName = tableName;
        this.read = read;
        this.write = write;
    }

    public getAll(): T[] {
        const db = this.read();
        return db[this.tableName] ?? [];
    }

    public getById(id: number): T | null {
        this.validateId(id);

        const db = this.read();
        const rows = db[this.tableName] ?? [];

        return rows.find((row) => row.id === id) ?? null;
    }

    public create(data: CreateData): T {
        const db = this.read();
        const rows = db[this.tableName] ?? [];

        const newId = this.generateId(rows);

        const newRow = {
            id: newId,
            ...data,
            createDate: new Date().toISOString(),
        } as unknown as T;

        rows.push(newRow);
        db[this.tableName] = rows;
        this.write(db);

        return newRow;
    }

    public update(id: number, patch: UpdateData): T | null {
        this.validateId(id);

        const db = this.read();
        const rows = db[this.tableName] ?? [];
        const index = rows.findIndex((row) => row.id === id);

        if (index === -1) {
            return null;
        }

        const currentRow = rows[index];

        if (!currentRow) {
            return null;
        }

        const updatedRow = {
            ...currentRow,
            ...patch,
            id,
        } as T;

        rows[index] = updatedRow;
        db[this.tableName] = rows;
        this.write(db);

        return updatedRow;
    }

    public delete(id: number): number | null {
        this.validateId(id);

        const db = this.read();
        const rows = db[this.tableName] ?? [];
        const filteredRows = rows.filter((row) => row.id !== id);

        if (filteredRows.length === rows.length) {
            return null;
        }

        db[this.tableName] = filteredRows;
        this.write(db);

        return id;
    }

    private validateId(id: number): void {
        if (typeof id !== "number" || Number.isNaN(id)) {
            throw new Error("Invalid id");
        }
    }

    private generateId(rows: T[]): number {
        if (rows.length === 0) {
            return 1;
        }

        const lastRow = rows[rows.length - 1];

        if (!lastRow) {
            return 1;
        }

        return lastRow.id + 1;
    }
}