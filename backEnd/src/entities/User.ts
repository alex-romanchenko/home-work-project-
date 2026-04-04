import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Newspost } from "./Newspost";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column({ select: false })
    password!: string;

    @OneToMany(() => Newspost, (newspost) => newspost.author)
    newsposts!: Newspost[];
}