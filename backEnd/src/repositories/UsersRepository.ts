import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export class UsersRepository {
    private readonly usersRepository = AppDataSource.getRepository(User);

    public async getByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
        });
    }

    public async create(user: Omit<User, "id" | "newsposts">): Promise<User> {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
}