import { Router } from "express";
import { UserService } from "../services/UserService.js";

export const UserRouter = Router()

UserRouter.get("/:id", async(req, res)=>{
    let userService = new UserService()
    let result = await userService.getUserInfo(req.params.id, req.userInfo)
    if(result.status){
        return res.status(200).json(result)
    }else if(result.type === "PERM_DENIED"){
        return res.status(403).json(result)
    }
    return res.status(404).json(result)
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

UserRouter.post("/update", async (req, res)=>{
    let userService = new UserService()
    let result = await userService.updateUserInfo(req.body)
    if(result.status){
        res.cookie('access_token', result.tokens.access, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            domain: process.env.COOKIE_DOMAIN,
            secure: true
        });
        res.cookie('refresh_token', result.tokens.refresh, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            domain: process.env.COOKIE_DOMAIN,
            secure: true
        });
        return res.status(200).json({status: true})
    }else if(result.type === "PERM_DENIED"){
        return res.status(403).json(result)
    }
    return res.status(500).json(result)
})