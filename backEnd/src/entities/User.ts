import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Newspost } from "./Newspost";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({ default: false })
    deleted!: boolean;

    @OneToMany(() => Newspost, (newspost) => newspost.author)
    newsposts!: Newspost[];
}