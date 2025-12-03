import { Util } from "../core/utils/Util.js"
import { AccessCodeRepo } from "../repos/AccessCodeRepo.js"
import { UserRepo } from "../repos/UserRepo.js"
import { Mailer } from "../core/Mailer.js"

export class AccessCodeService
{
    _repo

    constructor()
    {
        this._repo = new AccessCodeRepo()
    }

    async createLinkCode(obj)
    {
        const userRepo = new UserRepo()
        let cand = await userRepo.getByLogin(obj.login)
        if(cand){
            const util = new Util
            let path = util.generateRandomString(32)
            let code = util.generateSecureNumericString(6)
            let result = this._repo.createAccessCode({path: path, code: code, user_id: cand.id})
            if(result){
                let mail = new Mailer()
                let mailResult = await mail.sendMessageFromTemplate({
                    template: "forgotpass",
                    to: cand.email,
                    subject: "Код для восстановления пароля"
                }, 
                {
                    code: code,
                    link: `${process.env.DOMAIN}/auth/forgot/${path}`
                })
                if(mailResult.status){
                     return {
                        status: true,
                        link: `${process.env.DOMAIN}/auth/forgot/${path}`
                    }
                }else{
                    return {
                        status: false,
                        type: "INT_ERR",
                        msg: "Error while sending code"
                    }
                }
            }
            return {
                status: false,
                type: "SQL",
                msg: "Error while creating link and code"
            }
        }else{
            return {
                status: false,
                type: "NOT_FOUND",
                msg: "User wasn't found"
            }
        }
    }


}