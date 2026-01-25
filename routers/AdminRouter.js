import { Router } from "express"
import { Menu } from "../core/menu/Menu.js"
import { ApplicationService } from "../services/ApplicationService.js"
import { UserService } from "../services/UserService.js"
import { UserModel } from "../models/UserModel.js"
import { ScheduleService } from "../services/ScheduleService.js"

export const AdminRouter = Router()

AdminRouter.get("/applications", async(req, res)=>{
    let page = req.query.page
    if(!page){
        page = 1
    }
    let applicationService = new ApplicationService()
    let result = await applicationService.getApplications(req.query, page)
    let applications = []
    if(result.status){
        applications = result.applications
    }
    let menuitems = new Menu("authorized", req.userInfo).buildMenu()
    const data = {
        title: "Заявки от клиентов",
        hfEnabled: true,
        headerData: {
            userData: req.userInfo,
            menuItems: menuitems
        },
        page: "application",
        pageData: {
            prefix: "application",
            applications: applications,
            count: result.count,
            page: result.page,
            maxPage:result.maxPages
        }
    }
    return res.render("frame", data)
})

AdminRouter.get("/applications/:id/item", async(req, res)=>{
    let applicationService = new ApplicationService()
    let userService = new UserService()
    let result = await applicationService.getApplication(req.params.id)
    let applicationUser
    if(result.application.user_id){
        applicationUser = await userService.getUserInfo(result.application.user_id, req.userInfo)
    }
    let user = new UserModel()
    if(applicationUser && applicationUser.status){
        user = applicationUser.user
    }
    let menuitems = new Menu("authorized", req.userInfo).buildMenu()
    if(result.status){
        let scheduleService = new ScheduleService()
        let scheduleCand = await scheduleService.getLinked(result.application.id)
        const data = {
            title: `Заявка №${req.params.id} от клиента`,
            hfEnabled: true,
            headerData: {
                userData: req.userInfo,
                menuItems: menuitems
            },
            page: "application_item",
            pageData: {
                prefix: "application_item",
                applicationData: result.application,
                user: user,
                scheduleData: scheduleCand
            }
        }
        return res.render("frame", data)
    }else{
        const data = {
            title: "Не найдено",
            hfEnabled: true,
            headerData: {
                userData: req.userInfo,
                menuItems: []
            },
            page: "service_content/nf",
            pageData: {
                prefix: "nf"
            }
        }
        return res.render("frame", data)
    }
})

AdminRouter.post("/applications/:id/status", async(req, res)=>{
    let applicationService = new ApplicationService()
    let result = await applicationService.changeApplicationStatus(req.body)
    if(result.status){
        return res.status(200).json({
            status: "success",
            msg: result.msg
        })
    }else{
        return res.status(500).json({
            status: "error",
            error: result.msg
        })
    }
})

AdminRouter.get("/schedule/create", async(req, res)=>{
    let menuitems = new Menu("authorized", req.userInfo).buildMenu()
    const data = {
        title: `Создание фотосессии`,
        hfEnabled: true,
        headerData: {
            userData: req.userInfo,
            menuItems: menuitems
        },
        page: "schedule_new",
        pageData: {
            prefix: "schedule_new",
            applicationID: req.query.application || ""
        }
    }
    return res.render("frame", data)
})

AdminRouter.post("/schedule/create", async(req, res)=>{
    let scheduleService = new ScheduleService()
    let data = {
        name: req.body.name,
        description: req.body.desc,
        application_id: req.body.application || null,
        date: req.body.date
    }
    let result = await scheduleService.createSchedule(data)
    if(result.status){
        return res.status(200).json(result)
    }else if (result.type == 'BAD_RQ')
    {
        return res.status(400).json(result)
    }
    return res.status(500).json(result)
})