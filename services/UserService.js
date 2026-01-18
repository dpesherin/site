import { UserModel } from "../models/UserModel.js"
import { UserRepo } from "../repos/UserRepo.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class UserService
{
    _repo

    constructor()
    {
        this._repo = new UserRepo()
    }

    async deleteUser(id, providedByUser)
    {
        if(this.checkRights(id, providedByUser))
        {
            let result = await this._repo.delete(id)
            if(result)
            {
                return {
                    status: true
                }
            }
            return {
                status: false,
                type: "SQL",
                msg: "Error while delete user"
            }
        }
        return {
            status: false,
            type: "PERM_DENIED",
            msg: "Permission Denied"
        }
    }

    async getUserInfo(id, providedByUser)
    {
        if(this.checkRights(id, providedByUser))
        {
            let cand = await this._repo.getByID(id)
            if(cand){
                return {
                    status: true,
                    user: cand
                }
            }
            return {
                status: false,
                type: "NOT_FOUND",
                msg: "User wasn't found"
            }
        }
        return {
            status: false,
            type: "PERM_DENIED",
            msg: "Permission Denied"
        }
    }
    
    async updateUserInfo(userData, providedByUser)
    {
        if(this.checkRights(userData.id, providedByUser))
        {
            let userModel = new UserModel(userData)
            let cand = await this._repo.update(userModel)
            if(cand){
                let user = await this._repo.getByID(userModel.id)
                let access = jwt.sign(
                    {
                        id: user.id,
                        login: user.login,
                        email: user.email,
                        name: user.name,
                        lastname: user.lastname,
                        role: user.role
                    },
                    process.env.JWTSALT,
                    {
                        expiresIn: "1h"
                    }
                )
                let refresh = jwt.sign(
                    {
                        id: user.id,
                        login: user.login,
                        email: user.email,
                        name: user.name,
                        lastname: user.lastname,
                        role: user.role
                    },
                    process.env.JWTSALT,
                    {
                        expiresIn: "24h"
                    }
                )
                return {
                    status: true,
                    tokens: {
                        access: access,
                        refresh: refresh
                    }
                }
            }
            return {
                status: false,
                type: "SQL",
                msg: "Error while update user"
            }
        }
        return {
            status: false,
            type: "PERM_DENIED",
            msg: "Permission Denied"
        }
    } 

    async changeUserPass(data, providedByUser)
    {
        if(this.checkRights(data.id, providedByUser)){
            let crypted = bcrypt.hashSync(data.pass, parseInt(process.env.BCRYPT_SALT_LEN))
            try{
                await this._repo.changePass(data.id, crypted)
                return {
                    status: true,
                    msg: "Пароль успешно обновлен"
                }
            }catch(error){
                return {
                    status: false,
                    type: "SQL",
                    msg: "Error while update user"
                }
            }
        }
        return {
            status: false,
            type: "PERM_DENIED",
            msg: "Permission Denied"
        }
    }

    checkRights(id, providedByUser)
    {
        if(providedByUser.role !== "admin")
        {
            if(parseInt(providedByUser.id) === parseInt(id))
            {
                return true
            }
            return false
        }
        return true
    }
}