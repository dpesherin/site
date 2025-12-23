import { Router } from "express";
import {GetUserInfoMiddleware} from "../middlewares/GetUserInfoMiddleware.js"
import { Menu } from "../core/menu/Menu.js";

export const MainRouter = Router()

MainRouter.get("/", GetUserInfoMiddleware, (req, res)=>{
    const menu = new Menu()
    const data = {
        title: "Александра Кенециус. Частный фотограф",
        hfEnabled: true,
        headerData: {
            userData: req.userInfo,
            menuItems: menu.buildMenu()
        },
        page: "root",
        pageData: {
            prefix: "root",
            userData: req.userInfo
        }
    }
    return res.render("frame", data)
})