import { Router } from "express"
import { Menu } from "../core/menu/Menu.js"
import { ScheduleService } from "../services/ScheduleService.js"

export const PersonalRouter = Router()

PersonalRouter.get("/schedule", async (req, res)=>{
    let page = req.query.page
    if(!page){
        page = 1
    }
    let scheduleService = new ScheduleService()
    let result = await scheduleService.getSchedules(req.query, page, req.userInfo)
    let schedules = []
    if(result.status){
        schedules = result.schedules
    }
    let menuitems = new Menu("authorized", req.userInfo).buildMenu()
    const data = {
        title: `Список фотоссий`,
        hfEnabled: true,
        headerData: {
            userData: req.userInfo,
            menuItems: menuitems
        },
        page: "schedule_list",
        pageData: {
            prefix: "schedule_list",
            user: req.userInfo,
            schedules: schedules,
            count: result.count,
            page: result.page,
            maxPage:result.maxPages
        }
    }
    return res.render("frame", data)
})

PersonalRouter.get("/schedule/:id/item", async(req, res)=>{
    let scheduleService = new ScheduleService()
    let result = await scheduleService.getSchedule(req.params.id, req.userInfo)
    let menuitems = new Menu("authorized", req.userInfo).buildMenu()
    let data = {}
    if(result.status){
        data = {
            title: `Фотосессия ${result.schedule.id}`,
            hfEnabled: true,
            headerData: {
                userData: req.userInfo,
                menuItems: menuitems
            },
            page: "schedule_item",
            pageData: {
                prefix: "schedule_item",
                user: req.userInfo,
                scheduleData: result.schedule
            }
        }
    }else{
        data = {
            title: "Не найдено",
            hfEnabled: true,
            headerData: {
                userData: req.userInfo,
                menuItems: menuitems
            },
            page: "service_content/nf",
            pageData: {
                prefix: "nf"
            }
        }
    }
    
    return res.render("frame", data)
})