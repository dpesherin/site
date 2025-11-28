import express from "express"
import cors from "cors"


export class App 
{
    async start(){
        const expressApp = express()
        
        expressApp.use(cors())

        expressApp.get("/", (req, res)=>{
            return res.status(200).json({msg: "HELLO FROM SERVER"})
        })

        expressApp.listen(process.env.PORT, ()=>{
            console.log(`SERVER STARTED ON ${process.env.PORT} PORT`)
        })
    }
}