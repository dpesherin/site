import jwt from "jsonwebtoken"

export const AuthMiddleware = async (req, res, next) => {
    const isAuthPage = req.baseUrl === "/auth"
    
    try {
        const decoded = jwt.verify(req.cookies.access_token, process.env.JWTSALT)
        req.userInfo = decoded
        
        if (isAuthPage && (req.path === "/login" || req.path === "/register")) {
            const returnTo = req.query.returnTo || '/'
            return res.redirect(returnTo)
        }
        
        next()
        
    } catch (accessError) {
        try {
            const decoded = jwt.verify(req.cookies.refresh_token, process.env.JWTSALT)
            const userData = {
                id: decoded.id,
                login: decoded.login,
                email: decoded.email,
                name: decoded.name,
                lastname: decoded.lastname,
                role: decoded.role
            }
        
            const access = jwt.sign(userData, process.env.JWTSALT, { expiresIn: '1h' })
            const refresh = jwt.sign(userData, process.env.JWTSALT, { expiresIn: '24h' })
            
            res.cookie('access_token', access, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                secure: false,
                sameSite: 'lax',
                path: '/'
            })
            res.cookie('refresh_token', refresh, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: false,
                sameSite: 'lax',
                path: '/'
            })

            req.userInfo = decoded
            
            if (isAuthPage && (req.path === "/login" || req.path === "/register")) {
                const returnTo = req.query.returnTo || '/'
                return res.redirect(returnTo)
            }
            
            next()
            
        } catch (refreshError) {

            req.userInfo = null
            
            if (isAuthPage && (req.path === "/login" || req.path === "/register")) {
                return next()
            }
            
            return res.redirect(`/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`)
        }
    }
}