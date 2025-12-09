import { Router } from "express";
import {GetUserInfoMiddleware} from "../middlewares/GetUserInfoMiddleware.js"

export const MainRouter = Router()

MainRouter.get("/", GetUserInfoMiddleware, (req, res)=>{
    const data = {
        title: "Главная",
        hfEnabled: true,
        headerData: {
            userData: req.userInfo
        },
        page: "root",
        pageData: {
            prefix: "root",
            userData: req.userInfo
        }
    }
    return res.render("frame", data)
})