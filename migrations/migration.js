import dotenv from "dotenv"
import { DB } from "../db/db.js"

(async()=>{
    dotenv.config()
    const db = new DB()

    console.log("ℹ️  Start migration....")
    const createEnum = `
    CREATE TYPE application_status AS ENUM ('new', 'canceled', 'success');
    `
    await db.query(createEnum)

    const alterTable = `
        ALTER TABLE applications
        ADD COLUMN status application_status DEFAULT 'new';
    `
    await db.query(alterTable)
    console.log("\x1b[32m✅ Mirgation successfilly imported\x1b[0m")
})()