import { Router } from "express";

export const MainRouter = Router()

MainRouter.get("/", (req, res)=>{
    
    return res.status(200).json({ msg: "HELLO FROM SERVER" });
})