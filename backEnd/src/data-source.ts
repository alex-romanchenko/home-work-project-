import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entities/User";
import { Newspost } from "./entities/Newspost";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "homework_db",
    synchronize: false,
    logging: false,
    entities: [User, Newspost],
    migrations: [__dirname + "/migrations/*.js"],
    subscribers: [],
});