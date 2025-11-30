import {DB} from "../db/db.js"
import { UserModel } from "../models/UserModel.js"


export class UserRepo
{
    _db

    constructor()
    {
        this._db = new DB()
    }

    async getByID(id)
    {
        let sqlStatement = `SELECT id, login, email, active, name, lastname, role, date_create
        FROM users
        WHEREid=$1`
        let cand = await this._db.query(sqlStatement, [id])
        if(cand.length > 0)
        {
            return new UserModel(cand[0])
        }
        return false
    }

    async getByLogin(login)
    {
        let sqlStatement = `SELECT id, login, email, active, name, lastname, role, date_create
        FROM users
        WHERElogin=$1`
        let cand = await this._db.query(sqlStatement, [login])
        if(cand.length > 0)
        {
            return new UserModel(cand[0])
        }
        return false
    }

    async add(userModel)
    {
        let sqlStatement = `INSERT INTO users
        (login, email, active, name, lastname, password, role)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        )`
        try
        {
            await this._db.query(sqlStatement, [userModel.login, userModel.email, true, userModel.name, userModel.lastname, userModel.pass, userModel.role])
            return true
        }catch(e)
        {
            return false
        }
    }

    async setActive(id, isActive)
    {
        let sqlStatement = `UPDATE users
        SET
        active=$1
        WHERE
        id=$2`
        try
        {
            await this._db.query(sqlStatement, [isActive, id])
            return true
        }catch(e)
        {
            return false
        }
    }

    async update(id, userModel)
    {
        let sqlStatement = `Update users
        SET
        email=$1, name=$2, lastname=$3
        WHERE id=$4`
        try {
            await this._db.query(sqlStatement, [userModel.email, userModel.name, userModel.lastname, id])
            return true
        } catch (e) {
            return false
        }
    }

    async changePass(id, pass){
        let sqlStatement = `UPDATE users
        SET
        password=$1
        WHERE
        id=$2`
        try
        {
            await this._db.query(sqlStatement, [pass, id])
            return true
        }catch(e)
        {
            return false
        }
    }
}