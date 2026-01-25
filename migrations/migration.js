import dotenv from "dotenv"
import { DB } from "../db/db.js"

(async()=>{
    dotenv.config()
    const db = new DB()

    console.log("ℹ️  Start migration....")
    const alterType = `
        ALTER TYPE application_status ADD VALUE 'scheduled'
    `
    await db.query(alterType)
    console.log("\x1b[32m✅ Mirgation successfilly imported\x1b[0m")
})()