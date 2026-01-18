import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { CheckRouter } from "./routers/CheckRouter.js"
import {MainRouter} from "./routers/MainRouter.js"
import { UserRouter } from "./routers/UserRouter.js"
import { AuthMiddleware } from "./middlewares/AuthMiddleware.js"
import { AuthRouter } from "./routers/AuthRouter.js"
import { ApplicationRouter } from "./routers/ApplicationRouter.js"
import { getJsAsset } from "./core/utils/assetHelper.js"
import { formatToRussianDateTimeCustom } from "./core/utils/assetHelper.js"
import { GetUserInfoMiddleware } from "./middlewares/GetUserInfoMiddleware.js"
import { CheckAdminMiddleware } from "./middlewares/CheckAdminMiddleware.js"
import { AdminRouter } from "./routers/AdminRouter.js"
import {formatToRussianDateCustom} from "./core/utils/assetHelper.js"

export class App {
  constructor() {
    this._app = express()
    this._setupMiddleware()
    this._setupRoutes()
    this._app.locals.getJsAsset = getJsAsset;
    this._app.locals.formatToRussianDateTimeCustom = formatToRussianDateTimeCustom
    this._app.locals.formatToRussianDateCustom = formatToRussianDateCustom
  }

  _setupMiddleware() {
    this._app.set('trust proxy', true)
    this._app.use(cors({
      origin: 'https://kenecius.ru',
      credentials: true,
      exposedHeaders: ['set-cookie']
    }))
    this._app.use(express.json())
    this._app.use(cookieParser())
    this._app.set("view engine", "ejs")
    this._app.set("views", "./views")
    if(process.env.APP_MODE == "dev")
    {
      this._app.use(express.static("public_js"))
    }else{
      this._app.use(express.static("dist"))
    }
    this._app.use(express.static("static"))
  }

  _setupRoutes() {
    this._app.use(MainRouter)
    this._app.use("/check", CheckRouter)
    this._app.use("/user", AuthMiddleware, UserRouter)
    this._app.use("/auth", AuthRouter)
    this._app.use("/application", ApplicationRouter)
    this._app.use("/admin", AuthMiddleware, CheckAdminMiddleware, AdminRouter)
    this._app.use(GetUserInfoMiddleware, (req, res) => {
      const data = {
          title: "Не найдено",
          hfEnabled: true,
          headerData: {
              userData: req.userInfo,
              menuItems: []
          },
          page: "service_content/nf",
          pageData: {
              prefix: "nf"
          }
      }
      return res.render("frame", data)
    })
  }

  getApp() {
    return this._app
  }

  async start() {
    this._app.listen(process.env.PORT, () => {
      console.log(`SERVER STARTED ON ${process.env.PORT} PORT`)
      console.log(`${process.env.DOMAIN}/`)
    });
  }
}

export const app = new App().getApp()