import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, OneToOne, ManyToOne,
    JoinColumn } from "typeorm"
import { Category } from "./Category"
import {User} from "./User"

@Entity()
export class Post {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: "varchar",
        length:100
    })
    title: string

    @Column({
        type: "text"
    })
    content: string

    @OneToOne(() => Category)
    @JoinColumn()
    category: Category

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn()
    user: User

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
