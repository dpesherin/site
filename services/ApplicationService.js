import { ApplicationRepo } from "../repos/ApplicationRepo.js"
import { ApplicationModel } from "../models/ApplicationModel.js"
import { Mailer } from "../core/Mailer.js"
import { fileLoader } from "ejs"

export class ApplicationService
{
    _repo

    constructor()
    {
        this._repo = new ApplicationRepo()
    }

    async createApplication(data, userData)
    {
        let model = new ApplicationModel(data)
        if(model.date){
            model.date = new Date(model.date)
        }else{
            model.date = null
        }
        if(userData){
            model.lastname = userData.lastname
            model.user_id = userData.id 
        }
        if(model.agreement_confirmed){
            let result = await this._repo.createApplication(model)
            if(result){
                let mail = new Mailer()
                let mailResult = await mail.sendMessageFromTemplate({
                    template: "newapplication",
                    to: data.email,
                    subject: "Ваша заявка на фотосессию принята"
                }, 
                {
                    priorityContact: model.priority_contact,
                    date: data.date,
                    comment: model.description 
                })
                if(mailResult.status){
                    return {
                        status: true,
                        msg: "Application was creatred successfully"
                    }
                }else{
                    return {
                        status: false,
                        type: "INT_ERR",
                        msg: "Error while sending email notification"
                    }
                }
            }
            return {
                status: false,
                type: "SQL",
                msg: "Error while saving application"
            }
        }
        return {
            status: false,
            type: "BAD_RQ",
            msg: "Application wasn't confirmed"
        }
    }

    async getApplications(data, page){
        let filter = []
        let limit = 50
        let offset = limit*(page-1)
        if(data.type){
            filter.push({
                column: "status",
                type: "=",
                value: data.type
            })
        }
        try{
            let result = await this._repo.getList([], filter, limit, offset, "DESC")
            let count = await this._repo.getCount(filter)
            return {
                status: true,
                applications: result,
                count: count,
                page: page,
                maxPages: Math.ceil(count/limit)
            }
        }catch(sqlError){
            return {
                status: false,
                type: "SQL",
                msg: "Error while get applications"
            }
        }
    }

    async getApplication(id)
    {
        try{
            let result = await this._repo.getByID(id)
            if(result){
                return {
                    status: true,
                    application: result
                }
            }else{
                return {
                    status: false,
                    type: "NOT_FOUND",
                    msg: "Application wasn't found"
                }
            }
        }catch(sqlError){
            return {
                status: false,
                type: "SQL",
                msg: "Error while get application"
            }
        }
    }
    async changeApplicationStatus(obj)
    {
        try{
            let applicationModel = new ApplicationModel(obj)
            let result = await this._repo.changeStatus(applicationModel)
            if(result){
                return {
                    status: true,
                    msg: "Status of application successfilly updated"
                }
            }else{
                return {
                    status: false,
                    type: "NOT_FOUND",
                    msg: "Application wasn't found"
                }
            }
        }catch(sqlError){
            return {
                status: false,
                type: "SQL",
                msg: "Error while update status of application"
            }
        }
    }
}