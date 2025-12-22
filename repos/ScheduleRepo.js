import { DB } from "../db/db.js"
import { ScheduleModel } from "../models/ScheduleModel.js"

export class ScheduleRepo
{
    _db

    constructor()
    {
        this._db = new DB()
    }

    async getById(id)
    {
        let sqlStatement = `SELECT * FROM schedule
        WHERE id=$1`
        let cand = await this._db.query(sqlStatement, [id])
        if(cand.length > 0)
        {
            return new ScheduleModel(cand[0])
        }
        return false
    }

    async getList(select = [], filter = [], limit = null, offset = null){
        let selectVal = ""
        if(select.length > 0){
            selectVal = "*"
        }else{
            selectVal = select.join(", ")
        }
        let sqlStatement = `SELECT ${selectVal} FROM schedule`
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
        if(limit){
            sqlStatement += ` LIMIT ${limit}`
        }
        if(offset){
            sqlStatement+= ` OFFSET ${offset}`
        }
        let cands = await this._db.query(sqlStatement, vals)
        let result = []
        cands.forEach((c)=>{
            result.push(new ScheduleModel(c))
        })
        return result
    }
}