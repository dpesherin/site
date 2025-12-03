import {DB} from "../db/db.js"

export class AccessCodeRepo
{
    _db

    constructor()
    {
        this._db = new DB()
    }

    async createAccessCode(obj)
    {
        try {
            let sqlStatement = `INSERT INTO access_codes
            (guid, code, expires_at, user_id)
            VALUES
            ($1, $2, $3, $4)
            `
            let ts = new Date(Date.now() + 15 * 60 * 1000) //15 min
            await this._db.query(sqlStatement, [obj.path, obj.code, ts, obj.user_id])
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}