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

    async getList(select = [], filter = [], limit = 0, offset = 0, sort="ASC")
    {
        let selectVal = ""    
        if(select.length == 0){
                selectVal = "*"
        }else{
            selectVal = select.join(", ")
        }
        let sqlStatement = `SELECT ${selectVal} FROM applications`
        let filterIndex = 1
        let vals = []
        let filterArr = []
        filter.forEach(el => {
            let a = `${el.column} ${el.type} $${filterIndex}`
            filterIndex++
            vals.push(el.value)
            filterArr.push(a)
        });
        if(filterArr.length > 0){
            sqlStatement += ` WHERE ${filterArr.join(" AND ")}`
        }
        sqlStatement+=` ORDER BY id ${sort}`
        if(limit){
            sqlStatement += ` LIMIT ${limit}`
        }
        if(offset){
            sqlStatement+= ` OFFSET ${offset}`
        }
        let cands = await this._db.query(sqlStatement, vals)
        let result = []
        cands.forEach((c)=>{
            result.push(new ApplicationModel(c))
        })
        return result
    }
    
    async getCount(filter = [])
    {
        let selectVal = ""    
        let sqlStatement = `SELECT COUNT(id) FROM applications`
        let filterIndex = 1
        let vals = []
        let filterArr = []
        filter.forEach(el => {
            let a = `${el.column} ${el.type} $${filterIndex}`
            filterIndex++
            vals.push(el.value)
            filterArr.push(a)
        });
        if(filterArr.length > 0){
            sqlStatement += ` WHERE ${filterArr.join(" AND ")}`
        }
        let result = await this._db.query(sqlStatement, vals)
        return result[0].count
    }

    async getByID(id)
    {
        try{
            let sqlStatement = `SELECT * FROM applications WHERE id=$1`
            let result = await this._db.query(sqlStatement, [id])
            if(result.length > 0)
            {
                return result[0]
            }else{
                return false
            }
        }catch(sqlError){
            console.log(sqlError)
        }
    }
}