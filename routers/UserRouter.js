import { Router } from "express";
import { UserService } from "../services/UserService.js";
import { Menu } from "../core/menu/Menu.js";

export const UserRouter = Router()

UserRouter.get("/:id/profile", async(req, res)=>{
    let userService = new UserService()
    let result = await userService.getUserInfo(req.params.id, req.userInfo)
    if(result.status){
        let menuitems = new Menu("authorized", req.userInfo).buildMenu()
        const data = {
            title: `Профиль пользователя ${result.user.login}`,
            hfEnabled: true,
            headerData: {
                userData: req.userInfo,
                menuItems: menuitems
            },
            page: "profile",
            pageData: {
                prefix: "profile",
                userData: result.user
            }
        }
        return res.render("frame", data)
    }else if(result.type === "PERM_DENIED"){
         const data = {
            title: "Отказано в доступе",
            hfEnabled: true,
            headerData: {
                userData: req.userInfo,
                menuItems: []
            },
            page: "service_content/forbidden",
            pageData: {
                prefix: "forbidden"
            }
        }
        return res.render("frame", data)
    }
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
})

UserRouter.post("/delete", async (req, res)=>{
    let userService = new UserService()
    let result = await userService.deleteUser(req.body.id, req.userInfo)
    if(result.status)
    {
        return res.status(200).json(result)
    }else if(result.type === "PERM_DENIED"){
        return res.status(403).json(result)
    }
    return res.status(500).json(result)
})

UserRouter.post("/update/info", async (req, res)=>{
    let userService = new UserService()
    let result = await userService.updateUserInfo(req.body, req.userInfo)
    if(result.status){
        res.cookie('access_token', result.tokens.access, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });
        res.cookie('refresh_token', result.tokens.refresh, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });
        return res.status(200).json({status: true})
    }else if(result.type === "PERM_DENIED"){
        return res.status(403).json(result)
    }
    return res.status(500).json(result)
})

UserRouter.post("/update/pass", async (req, res)=>{
    let userService = new UserService()
    let result = await userService.changeUserPass(req.body, req.userInfo)
    if(result.status)
    {
        return res.status(200).json(result)
    }else if(result.type === "PERM_DENIED"){
        return res.status(403).json(result)
    }
    return res.status(500).json(result)
})