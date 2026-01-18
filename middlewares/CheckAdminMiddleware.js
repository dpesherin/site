export const CheckAdminMiddleware = (req, res, next)=>{
    if(req.userInfo.role === "admin"){
        next()
    }else{
        const data = {
            title: "Отказано в доступе",
            hfEnabled: true,
            headerData: {
                userData: req.userInfo,
                menuItems: []
            },
            page: "service_content/forbidden",
            pageData: {
                prefix: "forbidden"
            }
        }
        return res.render("frame", data)
    }
}