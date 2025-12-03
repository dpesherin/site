import dotenv from "dotenv"
import { Mailer } from "./core/Mailer.js"


(async ()=>{
    dotenv.config()

    let mail = new Mailer()
    console.log(await mail.sendMessageFromTemplate({
        template: "forgotpass",
        to: "pesherind@yandex.ru",
        subject: "TEST TEMPLATE"
    }, 
    {
        code: 123123123123123,
        link: "https://yandex.ru"
    }))
})()