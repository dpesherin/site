export const AuthMiddleware = (req, res, next)=>{
    console.log("Middleware Trigger")
    next()
}