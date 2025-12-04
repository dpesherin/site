import { Util } from "../core/utils/Util.js"
import { AccessCodeRepo } from "../repos/AccessCodeRepo.js"
import { UserRepo } from "../repos/UserRepo.js"
import { Mailer } from "../core/Mailer.js"
import bcrypt from "bcrypt"
import { AccessCodesModel } from "../models/AccessCodesModel.js"

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
            let accessCodesModel = new AccessCodesModel({
                guid: path,
                code: code,
                user_id: cand.id
            })
            let result = this._repo.createAccessCode(accessCodesModel)
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
                        msg: "Код и ссылка на восстановления пароля высланы на почту"
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

    async valudateQuery(obj)
    {
        let accessCodesModel = new AccessCodesModel(obj)
        const isSuccess = await this._repo.validateCode(accessCodesModel)
        if(isSuccess){
            return {
                status: true
            }
        }
        return {
            status: false,
            type: "NOT_FOUND",
            msg: "Pair of guid and key wasn't found"
        }
    }

    async changePass(obj)
    {
        const userRepo = new UserRepo()
        const codeInfo = await this._repo.getInfoByCode(obj.guid)
        let enc = bcrypt.hashSync(obj.password, parseInt(process.env.BCRYPT_SALT_LEN))
        let isSuccess = userRepo.changePass(codeInfo.user_id, enc)
        if(isSuccess){
            return {
                status: true
            }
        }
        return {
            status: false,
            type: "INT_ERR",
            msg: "Error while updating pass"
        }
    }
}