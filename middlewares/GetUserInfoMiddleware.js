import jwt from "jsonwebtoken"

export const GetUserInfoMiddleware = (req, res, next)=>{
    try
    {
        let decoded = jwt.decode(req.cookies.access_token, process.env.JWTSALT)
        req.userInfo = decoded
        next()
    } catch (error)
    {
        req.userInfo = {}
        next()
    }
}