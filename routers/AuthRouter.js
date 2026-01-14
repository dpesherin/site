import { Router } from "express"
import { AuthService } from "../services/AuthService.js"
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js" 
import { AccessCodeService } from "../services/AccessCodeService.js"
import { Util } from "../core/utils/Util.js"
import { TwoIPIntegration } from "../integration/TwoIPIntegration.js"

export const AuthRouter = Router()

AuthRouter.get("/login", AuthMiddleware, (req, res)=>{
    const data = {
        title: "Авторизация",
        hfEnabled: false,
        headerData: {},
        page: "login",
        pageData: {
            prefix: "login"
        }
    }
    return res.render("frame", data)
})

AuthRouter.get("/register", AuthMiddleware, (req, res)=>{
    const data = {
        title: "Регистрация",
        hfEnabled: false,
        headerData: {},
        page: "register",
        pageData: {
            prefix: "register"
        }
    }
    return res.render("frame", data)
})

AuthRouter.post("/login", async (req, res)=>{
    let authService = new AuthService()
    let result = await authService.authUser(req.body)
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
        return res.status(200).json(result)
    }
    return res.status(401).json(result)
})

AuthRouter.post("/register", async (req, res)=>{
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
    let util = new Util
    let ip = util.getIPInfo(req)
    let ipIntegration = new TwoIPIntegration(ip)
    let ipInfoModel = await ipIntegration.getGeoInfo()
    let accessService = new AccessCodeService()
    let result = await accessService.createLinkCode(req.body, ipInfoModel)
    if(result.status){
        return res.status(201).json(result)
    }else if(result.type == "NOT_FOUND"){
        return res.status(404).json(result)
    }
    return res.status(500).json(result)
})

AuthRouter.post("/checkcode", async (req, res)=>{
    let accessService = new AccessCodeService()
    let result = await accessService.validateQuery(req.body)
    if(result.status){
        return res.status(200).json(result)
    }
    return res.status(404).json(result)
})

AuthRouter.post("/changepass", async (req, res)=>{
    let accessService = new AccessCodeService()
    let result = await accessService.changePass(req.body)
    if(result.status){
        return res.status(200).json(result)
    }
    return res.status(500).json(result)
})

AuthRouter.get('/forgot/:guid', AuthMiddleware, (req, res)=>{
    const data = {
        title: "Проверка кода",
        hfEnabled: false,
        headerData: {},
        page: "restore",
        pageData: {
            prefix: "restore"
        }
    }
    return res.render("frame", data)
})

AuthRouter.get('/forgot', AuthMiddleware, async (req, res)=>{
    const data = {
        title: "Восстановление пароля",
        hfEnabled: false,
        headerData: {},
        page: "forgot",
        pageData: {
            prefix: "forgot"
        }
    }
    return res.render("frame", data)
})

AuthRouter.get("/revoke/:guid", async (req, res) => {
    let accessService = new AccessCodeService()
    let result = await accessService.revokeCodeByGuid(req.params.guid)
    if(result.status){
        const data = {
        title: "Отзыв восстановление пароля",
        hfEnabled: false,
        headerData: {},
        page: "revoke",
        pageData: {
            prefix: "revoke"
        }
    }
    return res.render("frame", data)
    }
    return res.status(500).json(result)
})