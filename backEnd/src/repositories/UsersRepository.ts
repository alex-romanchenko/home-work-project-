import { FileDB } from "../FileDB";
import type { User } from "../types/User";

export class UsersRepository {
    private readonly usersTable;

    constructor() {
        const fileDB = new FileDB("./db.json");

        const userSchema = {
            id: Number,
            email: String,
            password: String,
        };

        fileDB.registerSchema("users", userSchema);

        this.usersTable = fileDB.getTable<User, Omit<User, "id">, Partial<Omit<User, "id">>>("users");
    }

    public getByEmail(email: string): User | null {
        const users = this.usersTable.getAll();
        return users.find((user) => user.email === email) ?? null;
    }

    public create(user: Omit<User, "id">): User {
        return this.usersTable.create(user);
    }
}