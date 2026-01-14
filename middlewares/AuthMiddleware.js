import jwt from "jsonwebtoken"

export const AuthMiddleware = async (req, res, next) => {
    let isAuthPage = false
    if (req.baseUrl === "/auth") {
        isAuthPage = true
    }
    
    try {
        let decoded = jwt.verify(req.cookies.access_token, process.env.JWTSALT)
        req.userInfo = decoded
        if (isAuthPage) {
            const returnTo = req.query.returnTo || req.headers.referer || '/'
            return res.redirect(returnTo)
        }
        next()
    } catch (error) {
        try {
            let decoded = jwt.verify(req.cookies.refresh_token, process.env.JWTSALT)
            let userData = {
                id: decoded.id,
                login: decoded.login,
                email: decoded.email,
                name: decoded.name,
                lastname: decoded.lastname,
                role: decoded.role
            }
            // Генерируем новые токены
            let access = jwt.sign(
                userData,
                process.env.JWTSALT, 
                { 
                    expiresIn: '1h' 
                }
            )
            let refresh = jwt.sign(
                userData,
                process.env.JWTSALT,
                {
                    expiresIn: '24h'
                }
            )
            
            // Устанавливаем куки синхронно
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
            
            // Обратите внимание: куки будут установлены только после отправки заголовков
            if (isAuthPage) {
                const returnTo = req.query.returnTo || req.headers.referer || '/'
                return res.redirect(returnTo)
            }
            
            next()
            
        } catch (e) {
            if (isAuthPage) {
                next()
            } else {
                return res.redirect(301, `/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`)
            }
        }
    }
}