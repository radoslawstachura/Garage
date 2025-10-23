import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const repairsPool = new Pool({
    host: process.env.REPAIRS_DB_HOST,
    port: Number(process.env.REPAIRS_DB_PORT),
    database: process.env.REPAIRS_DB_NAME,
    user: process.env.REPAIRS_DB_USER,
    password: process.env.REPAIRS_DB_PASSWORD
});

export const mechanicsPool = new Pool({
    host: process.env.MECHANICS_DB_HOST,
    port: Number(process.env.MECHANICS_DB_PORT),
    database: process.env.MECHANICS_DB_NAME,
    user: process.env.MECHANICS_DB_USER,
    password: process.env.MECHANICS_DB_PASSWORD
});