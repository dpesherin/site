import express from "express"
import cors from "cors"
import { CheckRouter } from "./routers/CheckRouter.js"
import {MainRouter} from "./routers/MainRouter.js"
import { UserRouter } from "./routers/UserRouter.js"
import { AuthMiddleware } from "./middlewares/AuthMiddleware.js"
import { AuthRouter } from "./routers/AuthRouter.js"

export class App {
  constructor() {
    this._app = express()
    this._setupMiddleware()
    this._setupRoutes()
  }

  _setupMiddleware() {
    this._app.use(cors())
    this._app.use(express.json())
  }

  _setupRoutes() {
    this._app.use(MainRouter)
    this._app.use("/check", CheckRouter)
    this._app.use("/user",AuthMiddleware, UserRouter)
    this._app.use("/auth", AuthRouter)
  }

  getApp() {
    return this._app
  }

  async start() {
    this._app.listen(process.env.PORT, () => {
      console.log(`SERVER STARTED ON ${process.env.PORT} PORT`)
    });
  }
}

export const app = new App().getApp()