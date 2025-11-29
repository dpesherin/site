import express from "express";
import cors from "cors";
import { CheckRouter } from "./routers/CheckRouter.js";

export class App {
  constructor() {
    this._app = express();
    this._setupMiddleware();
    this._setupRoutes();
  }

  _setupMiddleware() {
    this._app.use(cors());
    this._app.use(express.json());
  }

  _setupRoutes() {
    this._app.use("/check", CheckRouter);
    
    this._app.get("/", (req, res) => {
      return res.status(200).json({ msg: "HELLO FROM SERVER" });
    });
  }

  getApp() {
    return this._app;
  }

  async start() {
    this._app.listen(process.env.PORT || 3000, () => {
      console.log(`SERVER STARTED ON ${process.env.PORT || 3000} PORT`);
    });
  }
}

export const app = new App().getApp();