import { Router } from "express";

export const CheckRouter = Router()

CheckRouter.get("/health", (req, res)=>{
    res.status(200).json({
        status: "OK"
    })
})