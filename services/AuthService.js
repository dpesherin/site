import { UserRepo } from "../repos/UserRepo.js"
import { UserModel } from "../models/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export class AuthService
{
    _repo

    constructor()
    {
        this._repo = new UserRepo()
    }

    async createUser(userData)
    {
        let check = await this._repo.checkDuplicates(userData.login, userData.pass)
        if(check)
        {
            let encPass = bcrypt.hashSync(userData.password, parseInt(process.env.BCRYPT_SALT_LEN))
            let userModel = new UserModel({
                login: userData.login,
                name: userData.name,
                email: userData.email,
                lastname: userData.lastname,
                password: encPass,
                role: "user"
            })
            let isSuccess = await this._repo.add(userModel)
            if(isSuccess){
                return {
                    status: true
                }
            }
            return {
                status: false,
                type: "SQL",
                msg: "Error while creating User"
            }
        }
        return {
            status: false,
            type: "DUP",
            msg: "User with this login or email arleady exists"
        }
    }

    async authUser(userData)
    {
        let cand = await this._repo.getByLogin(userData.login)
        if(cand)
        {
            let check = bcrypt.compareSync(userData.password, cand.password)
            if(check)
            {
                let access = jwt.sign(
                    {
                        id: cand.id,
                        login: cand.login,
                        email: cand.email,
                        name: cand.name,
                        lastname: cand.lastname,
                        role: cand.role
                    },
                    process.env.JWTSALT,
                    {
                        expiresIn: "1h"
                    }
                )
                 let refresh = jwt.sign(
                    {
                        id: cand.id,
                        login: cand.login,
                        email: cand.email,
                        name: cand.name,
                        lastname: cand.lastname,
                        role: cand.role
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
            msg: "Wrong login or password"
        }
        }
        return {
            status: false,
            msg: "User wasn't found"
        }
    }
}