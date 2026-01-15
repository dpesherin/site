import { ApplicationRepo } from "../repos/ApplicationRepo.js"
import { ApplicationModel } from "../models/ApplicationModel.js"
import { Mailer } from "../core/Mailer.js"

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

    async getApplications(data){
        let filter = []
        try{
            let result = await this._repo.getList([], filter, 50, 0, "DESC")
            return {
                status: true,
                applications: result
            }
        }catch(sqlError){
            return {
                status: false,
                type: "SQL",
                msg: "Error while get applications"
            }
        }
    }
}