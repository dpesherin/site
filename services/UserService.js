import { UserModel } from "../models/UserModel.js"
import { UserRepo } from "../repos/UserRepo.js"

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