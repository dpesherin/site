import dotenv from "dotenv"
import { DB } from "../db/db.js"

(async()=>{
    dotenv.config()
    const db = new DB()

    console.log("ℹ️  Start migration....")
    // const createEnum = `
    // CREATE TYPE schedule_status AS ENUM ('new', 'canceled', 'success');
    // `
    // await db.query(createEnum)

    // const alterTable = `
    //     ALTER TABLE schedule
    //     ADD COLUMN status schedule_status DEFAULT 'new';
    // `
    // await db.query(alterTable)

    const addColumn = `
        ALTER TABLE schedule
        ADD COLUMN date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `
    await db.query(addColumn)
    console.log("\x1b[32m✅ Mirgation successfilly imported\x1b[0m")
})()