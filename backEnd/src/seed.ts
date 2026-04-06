import "reflect-metadata";
import crypto from "crypto";
import { faker } from "@faker-js/faker";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { Newspost } from "./entities/Newspost";

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

async function seed() {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const newspostRepository = AppDataSource.getRepository(Newspost);

    let user = await userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.email = :email", { email: "seeduser@gmail.com" })
        .getOne();

    if (!user) {
        user = userRepository.create({
            email: "seeduser@gmail.com",
            password: hashPassword("123456"),
        });

        user = await userRepository.save(user);
    }

    const existingPostsCount = await newspostRepository.count();

    if (existingPostsCount < 20) {
        const postsToCreate = 20 - existingPostsCount;

        for (let i = 0; i < postsToCreate; i++) {
            const post = newspostRepository.create({
                header: faker.lorem.sentence(4),
                text: faker.lorem.paragraphs(2),
                deleted: false,
                author: user,
            });

            await newspostRepository.save(post);
        }
    }

    console.log("Seed completed");
    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error("Seed error:", error);
});