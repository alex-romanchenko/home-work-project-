import fs from "fs";
import { Table } from "./Table";
import type { Entity } from "./Table";

export class FileDB {
    private readonly filePath: string;
    private readonly schemas: Record<string, unknown>;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.schemas = {};

        this.initializeDatabase();
    }

    public registerSchema(tableName: string, schema: unknown): void {
        this.schemas[tableName] = schema;

        const db = this.read();

        if (!Array.isArray(db[tableName])) {
            db[tableName] = [];
            this.write(db);
        }
    }

    public getTable<T extends Entity, CreateData, UpdateData>(
        tableName: string
    ): Table<T, CreateData, UpdateData> {
        if (!this.schemas[tableName]) {
            throw new Error(`Table "${tableName}" is not registered`);
        }

        return new Table<T, CreateData, UpdateData>(
            tableName,
            () => this.read() as Record<string, T[]>,
            (db) => this.write(db as Record<string, unknown>)
        );
    }

    private initializeDatabase(): void {
        try {
            fs.accessSync(this.filePath);
        } catch {
            this.write({});
        }
    }

    private read(): Record<string, unknown> {
        try {
            const raw = fs.readFileSync(this.filePath, "utf-8");

            if (raw.trim() === "") {
                return {};
            }

            return JSON.parse(raw) as Record<string, unknown>;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error("db.json contains invalid JSON");
            }

            throw error;
        }
    }

    private write(db: Record<string, unknown>): void {
        fs.writeFileSync(this.filePath, JSON.stringify(db, null, 2), "utf-8");
    }
}