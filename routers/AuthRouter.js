import { Router } from "express"
import { AuthService } from "../services/AuthService.js"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js" 
import { AccessCodeService } from "../services/AccessCodeService.js"

export const AuthRouter = Router()

AuthRouter.get("/login", AuthMiddleware, (req, res)=>{
    return res.status(200).json({page: "Login Page"})
})

AuthRouter.get("/register", AuthMiddleware, (req, res)=>{
    return res.status(200).json({page: "Register Page"})
})

AuthRouter.post("/login", AuthMiddleware, async (req, res)=>{
    let authService = new AuthService()
    let result = await authService.authUser(req.body)
    if(result.status){
        res.cookie('access_token', result.tokens.access, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            secure: true
        });
        res.cookie('refresh_token', result.tokens.refresh, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true
        });
        return res.status(200).json(result)
    }
    return res.status(401).json(result)
})

AuthRouter.post("/register", AuthMiddleware, async (req, res)=>{
    let authService = new AuthService()
    let result = await authService.createUser(req.body)
    if(result.status){
        return res.status(201).json(result)
    }else if(result.type == "DUP"){
        return res.status(400).json(result)
    }
    return res.status(500).json(result)
})

AuthRouter.post("/forgot", async (req, res)=>{
    let accessService = new AccessCodeService()
    let result = await accessService.createLinkCode(req.body)
    if(result.status){
        return res.status(201).json(result)
    }else if(result.type == "NOT_FOUND"){
        return res.status(404).json(result)
    }
    return res.status(500).json(result)
})

AuthRouter.post("/checkcode", async (req, res)=>{
    let accessService = new AccessCodeService()
    let result = await accessService.valudateQuery(req.body)
    if(result.status){
        return res.status(200).json(result)
    }
    return res.status(404).json(result)
})

AuthRouter.post("/changepass", async (req, res)=>{
    let accessService = new AccessCodeService()
    let result = await accessService.changePass(req.body)
    if(result.status){
        return res.redirect(301, "/auth/login")
    }
    return res.status(500).json(result)
})