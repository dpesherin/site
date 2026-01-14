import { Router } from "express"
import { Menu } from "../core/menu/Menu.js"

export const AdminRouter = Router()

AdminRouter.get("/applications", async(req, res)=>{
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
            prefix: "application"
        }
    }
    return res.render("frame", data)
})