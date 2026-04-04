console.log("LOGIN METHOD STARTED");

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UsersRepository } from "../repositories/UsersRepository";
import { ValidationError } from "../errors/ValidationError";
import { NewspostsServiceError } from "../errors/NewspostsServiceError";
import type { LoginData, RegisterData, User } from "../types/User";

const JWT_SECRET = "super_secret_key";

export class AuthService {
    private readonly usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    }

    private hashPassword(password: string): string {
        return crypto.createHash("sha256").update(password).digest("hex");
    }

    private generateToken(user: User): string {
        const token = jwt.sign(
            { email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return `Bearer ${token}`;
    }

    public async register(data: RegisterData): Promise<{ token: string }> {
        const { email, password, confirmPassword } = data;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new ValidationError("Invalid register data", ["email is not valid"]);
        }

        if (password !== confirmPassword) {
            throw new ValidationError("Invalid register data", ["passwords do not match"]);
        }

        const existingUser = await this.usersRepository.getByEmail(email);

        if (existingUser) {
            throw new ValidationError("Invalid register data", ["user already exists"]);
        }

        const hashedPassword = this.hashPassword(password);

        const createdUser = await this.usersRepository.create({
            email,
            password: hashedPassword,
        });

        console.log("REGISTER email:", email);
        console.log("REGISTER raw password:", password);
        console.log("REGISTER hashed password:", hashedPassword);
        console.log("REGISTER created user:", createdUser);

        return {
            token: this.generateToken(createdUser),
        };
    }

    public async login(data: LoginData): Promise<{ token: string }> {
        const { email, password } = data;

        const user = await this.usersRepository.getByEmail(email);
        console.log("LOGIN email:", email);
        console.log("LOGIN raw password:", password);
        console.log("LOGIN user from db:", user);

        if (!user) {
            throw new ValidationError("Invalid login data", ["user not found"]);
        }

        const hashedPassword = this.hashPassword(password);
        console.log("LOGIN hashed password:", hashedPassword);
        console.log("LOGIN db password:", user?.password);

        if (user.password !== hashedPassword) {
            throw new ValidationError("Invalid login data", ["wrong password"]);
        }

        return {
            token: this.generateToken(user),
        };
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.usersRepository.getByEmail(email);
        } catch {
            throw new NewspostsServiceError("Failed to get user");
        }
    }
}