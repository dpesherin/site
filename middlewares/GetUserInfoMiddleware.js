import jwt from "jsonwebtoken"

export const AuthMiddleware = (req, res, next)=>{
    try
    {
        let decoded = jwt.decode(req.cookies.access_token, process.env.JWTSALT)
        req.userInfo = decoded
        next()
    } catch (error)
    {
        next()
    }
}