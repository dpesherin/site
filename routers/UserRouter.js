import { Router } from "express";

export const UserRouter = Router()

UserRouter.get("/:id", (req, res)=>{
    let userID = req.params.id
    return res.status(200).json({userID: userID})
})