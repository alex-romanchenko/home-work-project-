import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Newspost } from "./entities/Newspost";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "963451",
    database: "homework_db",
    synchronize: false,
    logging: false,
    entities: [User, Newspost],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});