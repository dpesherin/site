import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const AuthRouter = Router()

AuthRouter.get("/login", (req, res)=>{
    return res.status(200).json({page: "Login Page"})
})

AuthRouter.get("/register", (req, res)=>{
    return res.status(200).json({page: "Register Page"})
})