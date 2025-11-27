import {Pool} from "pg"

export class DB{
    _connection

    constructor() {
        this._connection = new Pool({
            host: process.env.POSTGRES_HOST,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASS,
            database: process.env.POSTGRES_DATABASE,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            maxLifetimeSeconds: 60
        })
    }

    async query(sqlStatement, values = []){
        try{
            const res = await this._connection.query(sqlStatement, values)
            return res.rows
        }catch (e) {
            throw new Error(e.message)
        }
    }
}
