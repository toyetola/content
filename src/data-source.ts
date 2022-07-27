import "reflect-metadata"
import { DataSource } from "typeorm"
import { Category } from "./entity/Category"
import { Post } from "./entity/Post"
import { User } from "./entity/User"
const dotenv = require('dotenv')

dotenv.config()

/* let db_host : string = process.env.DB_HOST
let  db_port: number = parseInt(process.env.DB_HOST) */

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Post, Category],
    migrations: [],
    subscribers: [],
})
