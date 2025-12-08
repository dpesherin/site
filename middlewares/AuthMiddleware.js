import jwt from "jsonwebtoken"

export const AuthMiddleware = (req, res, next)=>{
    console.log(req.path)
    // const isAuthPage = req.path === '/login' || req.path === '/register'
    try
    {
        let decoded = jwt.verify(req.cookies.access_token, process.env.JWTSALT)
        req.userInfo = decoded
        // if (isAuthPage) {
        //     const redirectTo = req.headers.referer || '/'
        //     return res.redirect(redirectTo)
        // }
        next()
    } catch (error)
    {
        console.log("NOT DECODED")
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
                maxAge: 60 * 60 * 1000,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            res.cookie('refresh_token', refresh, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            req.userInfo = decoded
            //  if (isAuthPage) {
            //     const redirectTo = req.headers.referer || '/'
            //     return res.redirect(redirectTo)
            // }
            next()
        }catch(e)
        {
            // if (isAuthPage) {
            //     next()
            // } else {
                return res.redirect(301, `/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`)
            // }
        }
    }
}