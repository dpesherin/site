import { ScheduleRepo } from "../repos/ScheduleRepo.js";
import { ScheduleModel } from "../models/ScheduleModel.js";

export class ScheduleService
{
    _repo
    
    constructor()
    {
        this._repo = new ScheduleRepo()
    }

    async createSchedule(data, userData)
    {
        if(userData.role === "admin"){
            let model = new ScheduleModel(data)
            if(model.date){
                model.date = new Date(model.date)
            }else{
                model.date = null
            }
            let result = await this._repo.createSchedule(model)
            if(result){
                return {
                    status: true,
                    msg: "Schedule was creatred successfully"
                }
            }else{
                return {
                    status: false,
                    type: "SQL",
                    msg: "Error while saving schedule"
                }
            }
        }else{
            return {
                status: false,
                type: "PERM_DENIED",
                msg: "Permission Denied"
            }
        }
    }

    async getSchedule(id, userData)
    {
        try{
            let result = await this._repo.getById(id)
            if(userData.role === "admin"){
                if(result){
                    return {
                        status: true,
                        schedule: result
                    }
                }else{
                    return {
                        status: false,
                        type: "NOT_FOUND",
                        msg: "Schedule wasn't found"
                    }
                }
            }else{
                if(result){
                    if(userData.id === result.user_id){
                        return {
                            status: true,
                            schedule: result
                        }
                    }
                }
                return {
                    status: false,
                    type: "NOT_FOUND",
                    msg: "Schedule wasn't found"
                }
            }
        }catch(sqlError){
            return {
                status: false,
                type: "SQL",
                msg: "Error while get schedule"
            }
        }
    }

    async getSchedules(data, page, userData)
    {
        let filter = []
        if(userData.role != "admin"){
            filter.push({
                column: "user_id",
                type: "=",
                value: userData.id
            })
        }
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
                schedules: result,
                count: count,
                page: page,
                maxPages: Math.ceil(count/limit)
            }
        }catch(sqlError){
            return {
                status: false,
                type: "SQL",
                msg: "Error while get schedules"
            }
        }
    }

    async getLinked(applID){
        let limit = 1
        let offset = 0
        let filter = [
            {
                column: "application_id",
                type: "=",
                value: applID
            }
        ]
        try{
            let result = await this._repo.getList([], filter, limit, offset, "DESC")
            if(result.length > 0){
                return {
                    status: true,
                    schedule: result[0]
                }
            }else{
                return {
                    status: false,
                    type: "NOT_FOUND",
                    msg: "Linked applicatiuon wasn't found"
                }
            }
        }catch(sqlError){
            return {
                status: false,
                type: "SQL",
                msg: "Error while get schedules"
            }
        }
    }
    
}