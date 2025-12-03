import dotenv from "dotenv"
import { DB } from "../db/db.js"
import bcrypt from "bcrypt"

(async()=>{
    dotenv.config()
    const db = new DB()
    console.log("ℹ️  USERS TABLE IMPORTING....")
    const installUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        login TEXT NOT NULL UNIQUE,
        active BOOLEAN NOT NULL,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        lastname TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await db.query(installUserTable)
    console.log("\x1b[32m✅ USERS TABLE SUCCESSFULLY IMPORTED\x1b[0m")

    console.log("ℹ️  FILES TABLE IMPORTING....")
    const installFilesTable = `
    CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size REAL NOT NULL,
        path TEXT NOT NULL,
        date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await db.query(installFilesTable)
    console.log("\x1b[32m✅ FILES TABLE SUCCESSFULLY IMPORTED\x1b[0m")

    console.log("ℹ️  APPLICATIONS TABLE IMPORTING....")
    const installApplicationsTable = `
    CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        lastname TEXT,
        priority_contact TEXT NOT NULL,
        description TEXT,
        date TIMESTAMP,
        user_id INT,
        agreement_confirmed BOOLEAN NOT NULL,
        date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await db.query(installApplicationsTable)
    console.log("\x1b[32m✅ APPLICATIONS TABLE SUCCESSFULLY IMPORTED\x1b[0m")

    console.log("ℹ️  SCHEDULE TABLE IMPORTING....")
    const installScheduleTable = `
    CREATE TABLE IF NOT EXISTS schedule (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        user_id INT,
        date TIMESTAMP
    );
    `
    await db.query(installScheduleTable)
    console.log("\x1b[32m✅ SCHEDULE TABLE SUCCESSFULLY IMPORTED\x1b[0m")

    console.log("ℹ️  PHOTOSESSIONS TABLE IMPORTING....")
    const installPhoteSessionsTable = `
    CREATE TABLE IF NOT EXISTS photosessions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        arch_id INT NOT NULL,
        schedule_ID INT NOT NULL,
        date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await db.query(installPhoteSessionsTable)
    console.log("\x1b[32m✅ PHOTOSESSIONS TABLE SUCCESSFULLY IMPORTED\x1b[0m")

    console.log("ℹ️  ACCESSCODES TABLE IMPORTING....")
    const installAccessCodesTable = `
    CREATE TABLE IF NOT EXISTS access_codes (
        id SERIAL PRIMARY KEY,
        guid TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        user_id INTEGER
    );
    `
    await db.query(installAccessCodesTable)
    console.log("\x1b[32m✅ ACCESSCODES TABLE SUCCESSFULLY IMPORTED\x1b[0m")

    console.log("ℹ️  CREATING ADMIN USER....")
    const candUserQuery = `
    SELECT * 
    FROM users
    WHERE
    id=1;
    `
    let cand = await db.query(candUserQuery)
    if(cand.length == 0)
    {
        const userData = {
            login: process.env.ADMIN_LOGIN,
            email: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASS
        }
        const cryptPass = bcrypt.hashSync(userData.pass, parseInt(process.env.BCRYPT_SALT_LEN))
        const createUserQuery =`
            INSERT INTO users
            (active, email, login, password, role) 
            VALUES
            ($1, $2, $3, $4, $5)
        `
        await db.query(createUserQuery, [true, userData.email, userData.login, cryptPass, 'admin'])
        console.log("\x1b[32m✅ ADMIN USER CREATED SUCCESSFULLY\x1b[0m")
        console.table(userData)
    }else
    {
        console.log("\x1b[31m❌ ADMIN USER ALREARY EXISTS\x1b[0m")
    }
    return
})()