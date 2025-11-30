import { UserRepo } from "../repos/UserRepo.js"
import { UserModel } from "../models/UserModel.js"
import bcrypt from "bcrypt"

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
            let encPass = bcrypt.hashSync(userData.pass, parseInt(process.env.BCRYPT_SALT_LEN))
            let userModel = new UserModel({
                login: userData.login,
                name: userData.name,
                email: userData.email,
                lastname: userData.lastname,
                pass: encPass,
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
}