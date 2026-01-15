import { Router } from "express"
import { Menu } from "../core/menu/Menu.js"
import { ApplicationService } from "../services/ApplicationService.js"

export const AdminRouter = Router()

AdminRouter.get("/applications", async(req, res)=>{
    let applicationService = new ApplicationService()
    let result = await applicationService.getApplications(req.body)
    let applications = []
    if(result.status){
        applications = result.applications
    }
    console.log(applications)
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
            applications: applications
        }
    }
    return res.render("frame", data)
})