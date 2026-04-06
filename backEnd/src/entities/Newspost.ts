import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("newspost")
export class Newspost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    header!: string;

    @Column()
    text!: string;

    @Column({ default: false })
    deleted!: boolean;

    @ManyToOne(() => User, (user) => user.newsposts)
    author!: User;
}