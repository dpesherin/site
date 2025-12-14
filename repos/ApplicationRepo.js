import { DB } from "../db/db.js"
import { ApplicationModel } from "../models/ApplicationModel.js"

export class ApplicationRepo
{
    _db

    constructor(){
        this._db = new DB()
    }

    async createApplication(applicationModel)
    {
        let sqlStatement = `INSERT INTO applications
        (name, lastname, priority_contact, description, date, user_id, agreement_confirmed)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7);`
        try
        {
            await this._db.query(sqlStatement, [
                applicationModel.name, 
                applicationModel.lastname,
                applicationModel.priority_contact,
                applicationModel.description,
                applicationModel.date,
                applicationModel.user_id,
                applicationModel.agreement_confirmed
            ])
            return true
        }catch(err){
            return false
        }
    }
}