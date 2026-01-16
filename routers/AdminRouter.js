import { Router } from "express"
import { Menu } from "../core/menu/Menu.js"
import { ApplicationService } from "../services/ApplicationService.js"
import { template } from "@babel/core"

export const AdminRouter = Router()

AdminRouter.get("/applications", async(req, res)=>{
    let page = req.query.page
    if(!page){
        page = 1
    }
    let applicationService = new ApplicationService()
    let result = await applicationService.getApplications(req.body, page)
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
    let result = await applicationService.getApplication(req.params.id)
    let menuitems = new Menu("authorized", req.userInfo).buildMenu()
    if(result.status){
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
                applicationData: result.application
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
            page: "nf",
            pageData: {
                prefix: "nf"
            }
        }
        return res.render("frame", data)
    }
})