import { ApplicationRepo } from "../repos/ApplicationRepo.js"
import { ApplicationModel } from "../models/ApplicationModel.js"

export class ApplicationService
{
    _repo

    constructor()
    {
        this._repo = new ApplicationRepo()
    }

    async createApplication(data)
    {
        let model = new ApplicationModel(data)
        if(model.agreement_confirmed){
            let result = await this._repo.createApplication(model)
            if(result){
                return {
                    status: true,
                    msg: "Application was creatred successfully"
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
}