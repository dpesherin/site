import dotenv from "dotenv"
import { DB } from "../db/db.js"
import bcrypt from "bcrypt"

(async()=>{
    dotenv.config()
    const db = new DB()
    console.log("USERS TABLE IMPORTING....")
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
    console.log("%cUSERS TABLE SUCCESSFULLY IMPORTED", 'color: green; font-size: 16px; font-weight: bold;')

    console.log("FILES TABLE IMPORTING....")
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
    console.log("%cFILES TABLE SUCCESSFULLY IMPORTED", 'color: green; font-size: 16px; font-weight: bold;')

    console.log("APPLICATIONS TABLE IMPORTING....")
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
    console.log("%cAPPLICATIONS TABLE SUCCESSFULLY IMPORTED", 'color: green; font-size: 16px; font-weight: bold;')

    console.log("SCHEDULE TABLE IMPORTING....")
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
    console.log("%cSCHEDULE TABLE SUCCESSFULLY IMPORTED", 'color: green; font-size: 16px; font-weight: bold;')

    console.log("PHOTOSESSIONS TABLE IMPORTING....")
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
    console.log("%cPHOTOSESSIONS TABLE SUCCESSFULLY IMPORTED", 'color: green; font-size: 16px; font-weight: bold;')

    console.log("CREATING ADMIN USER....")
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
        console.log("%cADMIN USER CREATED SUCCESSFULLY", 'color: green; font-size: 16px; font-weight: bold;')
        console.table(userData)
    }else
    {
        console.log("%cADMIN USER ALREARY EXISTS", 'color: red; font-size: 16px; font-weight: bold;')
    }
})()