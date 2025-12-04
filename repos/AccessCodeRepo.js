import {DB} from "../db/db.js"
import { AccessCodesModel } from "../models/AccessCodesModel.js"

export class AccessCodeRepo
{
    _db

    constructor()
    {
        this._db = new DB()
    }

    async createAccessCode(accessCodesModel)
    {
        try {
            let sqlStatement = `INSERT INTO access_codes
            (guid, code, expires_at, user_id)
            VALUES
            ($1, $2, $3, $4)
            `
            let ts = new Date(Date.now() + 15 * 60 * 1000) //15 min
            await this._db.query(sqlStatement, [accessCodesModel.guid, accessCodesModel.code, ts, accessCodesModel.user_id])
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async getInfoByCode(guid)
    {
        try {
            let sqlStatement = `SELECT *
            FROM access_codes
            WHERE 
            giud=$1`
            let info = await this._db.query(sqlStatement, [guid])
            if(info.length > 0)
            {
                return new AccessCodesModel(info[0])
            }
            return false
        } catch (error) {
            return false
        }
    }

    async validateCode(accessCodesModel)
    {
        console.log(accessCodesModel.guid, accessCodesModel.code)
        try {
            let sqlStatement = `SELECT * 
            FROM access_codes
            WHERE
            guid=$1
            AND
            code=$2
            AND 
            expires_at > NOW()`
            let cand = await this._db.query(sqlStatement, [accessCodesModel.guid, accessCodesModel.code])
            if(cand.length > 0){
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }
}