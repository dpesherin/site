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

AuthRouter.post("/login", (req, res)=>{
    return res.status(200).json({page: "Login API"})
})

AuthRouter.post("/register", async (req, res)=>{
    let authService = new AuthService()
    let result = await authService.createUser(req.body)
    if(result.status){
        return res.status(200).json(result)
    }else if(result.type == "DUP"){
        return res.status(400).json(result)
    }
    return res.status(500).json(result)
})