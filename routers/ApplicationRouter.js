import { Router } from "express"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js"
import {GetUserInfoMiddleware} from "../middlewares/GetUserInfoMiddleware.js"
import { ApplicationService } from "../services/ApplicationService.js"

export const ApplicationRouter = Router()

ApplicationRouter.post("/add", GetUserInfoMiddleware, async (req, res) => {
    let data = req.body
    if(req.userInfo)
    {
        data.user_id = req.userInfo.id
    }
    let applicationService = new ApplicationService()
    let result = await applicationService.createApplication(data, req.userInfo)
    if(result.status){
        return res.status(200).json(result)
    }else if (result.type == 'BAD_RQ')
    {
        return res.status(400).json(result)
    }
    return res.status(500).json(result)
})