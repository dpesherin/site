import jwt from "jsonwebtoken"

export const AuthMiddleware = (req, res, next)=>{
    try 
    {
        let decoded = jwt.verify(req.cookies.access_token, process.env.JWTSALT)
        req.userInfo = decoded
        next()
    } catch (error)
    {
        try
        {
            let decoded = jwt.verify(req.cookies.refresh_token, process.env.JWTSALT)
            let access = jwt.sign(
                decoded,
                process.env.JWTSALT, 
                { 
                    expiresIn: '1h' 
                }
            )
            let refresh = jwt.sign(
                decoded,
                process.env.JWTSALT,
                {
                    expiresIn: '24h'
                }
            )
            res.cookie('access_token', access, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            });
            res.cookie('refresh_token', refresh, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            req.userInfo = decoded
            next()
        }catch(e)
        {
            return res.status(302).redirect("/auth/login")
        }
    }
}