import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn,
    OneToMany} from "typeorm"
import { Post } from "./Post"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        type: "varchar",
        length:100,
        nullable:true
    })
    firstname: string

    @Column({
        type: "varchar",
        length:100,
        nullable:true
    })
    lastname: string

    @Column({
        type: "varchar",
        unique:true
    })
    email: string

    @Column({select:false})
    password: string

    @Column({
        nullable : true,
        unique : true
    })
    password_recovery_token: string

    @Column({nullable:true, select:false})
    accessToken: string

    @OneToMany(() => Post, (post) => post.user)
    posts: Post

    @Column({
        default: "user"
    })
    role : string

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

}
