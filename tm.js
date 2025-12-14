import dotenv from "dotenv"
import { Mailer } from "./core/Mailer.js"


(async ()=>{
    dotenv.config()

    let mail = new Mailer()
    console.log(await mail.sendMessageFromTemplate({
        template: "newapplication",
        to: "pesherind@yandex.ru",
        subject: "TEST TEMPLATE"
    }, 
    {
        priorityContact: "+7 777 777 77 77",
        date: '24.12.2025',
        comment: "TEST TEST TEST TEST" 
    }))
})()