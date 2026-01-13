import { Router } from "express"

export const AdminRouter = Router()

AdminRouter.get("/applications", async(req, res)=>{
    let menuitems = []
    menuitems.push(
        {
            href: "/admin/applications",
            name: "Заявки"
        }
    )
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