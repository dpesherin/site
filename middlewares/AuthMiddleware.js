import jwt from "jsonwebtoken"

export const AuthMiddleware = async (req, res, next) => {
    
    // Определяем тип страницы
    const isLoginPage = req.path.includes('/auth/login') || req.path === '/login'
    const isRegisterPage = req.path.includes('/auth/register') || req.path === '/register'
    
    // 1. Пытаемся получить пользователя из токенов
    let user = null
    let tokensRefreshed = false
    
    try {
        // Проверяем access_token
        if (req.cookies.access_token) {
            user = jwt.verify(req.cookies.access_token, process.env.JWTSALT)
        } else {
            throw new Error('No access token')
        }
    } catch (accessError) {
        
        // Пробуем refresh_token ТОЛЬКО если он есть
        if (req.cookies.refresh_token) {
            try {
                user = jwt.verify(req.cookies.refresh_token, process.env.JWTSALT)
                
                // ВАЖНО: Проверяем структуру user
                if (!user.id) {
                    throw new Error('Invalid user data in token')
                }
                
                // Обновляем оба токена
                const userData = {
                    id: user.id,
                    login: user.login || user.username || '',
                    email: user.email || '',
                    name: user.name || '',
                    lastname: user.lastname || '',
                    role: user.role || 'user'
                }
                
                const newAccess = jwt.sign(userData, process.env.JWTSALT, { expiresIn: '1h' })
                const newRefresh = jwt.sign(userData, process.env.JWTSALT, { expiresIn: '24h' })
                
                // Устанавливаем новые куки
                res.cookie('access_token', newAccess, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                    path: '/'
                })
                
                res.cookie('refresh_token', newRefresh, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                    path: '/'
                })
                
                tokensRefreshed = true
                
                // Используем обновленные данные пользователя
                user = userData
                
            } catch (refreshError) {
                user = null
            }
        } else {
            user = null
        }
    }
    
    // Сохраняем пользователя в request
    req.userInfo = user
    
    // 2. Логика для страниц авторизации
    if (isLoginPage || isRegisterPage) {
        if (user) {
            // Пользователь уже авторизован
            const returnTo = req.query.returnTo || '/'
            return res.redirect(302, returnTo)
        } else {
            // Показываем страницу авторизации
            return next()
        }
    }
    
    // 3. Логика для защищенных страниц
    if (!user) {
        // Перенаправляем на логин
        const returnTo = encodeURIComponent(req.originalUrl)
        return res.redirect(302, `/auth/login?returnTo=${returnTo}`)
    }
    
    // 4. Пользователь авторизован
    return next()
}