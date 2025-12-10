import { Router } from "express";
import {GetUserInfoMiddleware} from "../middlewares/GetUserInfoMiddleware.js"

export const MainRouter = Router()

MainRouter.get("/", GetUserInfoMiddleware, (req, res)=>{
    const data = {
        title: "Главная",
        hfEnabled: true,
        headerData: {
            userData: req.userInfo,
            menuItems: [
                {
                    href: "#",
                    name: "О фотографе"
                },
                {
                    href: "#",
                    name: "Портфолио"
                },
                {
                    href: "#faq",
                    name: "FAQ"
                },
                {
                    href: "#form",
                    name: "Хочу фотосессию"
                }
            ]
        },
        page: "root",
        pageData: {
            prefix: "root",
            userData: req.userInfo
        }
    }
    return res.render("frame", data)
})