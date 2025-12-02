import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AuthService } from "../services/AuthService.js"

export const AuthRouter = Router()

AuthRouter.get("/login", (req, res)=>{
    return res.status(200).json({page: "Login Page"})
})

AuthRouter.get("/register", (req, res)=>{
    return res.status(200).json({page: "Register Page"})
})

AuthRouter.post("/login", async (req, res)=>{
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