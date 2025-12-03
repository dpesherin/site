import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"
import nhtt from "nodemailer-html-to-text"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export class Mailer
{
    _transport

    constructor()
    {
        this._transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        })
    }

    async sendMessage(obj)
    {
        try {
            const info = await this._transport.sendMail({
                from: process.env.SMTP_SENDER,
                to: obj.to,
                subject: obj.subject,
                text: obj.text,
            });

            if(info.messageId)
            {
                return {
                    status: true
                }
            }
            return {
                status: false,
                type: "MSG_DONT_SEND",
                msg: "Message don't send"
            }
            
        } catch (err) {
            return {
                status: false,
                type: "INT_ERR",
                msg: err.message
            }
        }
    }

    async sendMessageFromTemplate(obj, msgObj)
    {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        this._transport.use('compile', nhtt.htmlToText())
        try {
            const templatePath = path.join(
            __dirname, 
            './mailtemplate', 
            `${obj.template}.ejs`
            )
            const html = await ejs.renderFile(templatePath, msgObj)

            const info = await this._transport.sendMail({
                from: process.env.SMTP_SENDER,
                to: obj.to,
                subject: obj.subject,
                html: html,
            });

            if(info.messageId)
            {
                return {
                    status: true
                }
            }
            return {
                status: false,
                type: "MSG_DONT_SEND",
                msg: "Message don't send"
            }
        } catch (err) {
            return {
                status: false,
                type: "INT_ERR",
                msg: err.message
            }
        }
    }
}