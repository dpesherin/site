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
    let result = await scheduleService.getSchedules(req.query, page)
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