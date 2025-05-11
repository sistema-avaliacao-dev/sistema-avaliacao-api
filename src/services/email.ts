import * as nodemailer from "nodemailer";
import configEmail from "../config/email"
import { ResponseHandler } from "../middlewares/ResponseHandler";
import { Response } from "express";

class Email {
    send(res: Response, email: string,  subject: string, message: string) {

        let emailOptions = {
            from: configEmail.user,
            to: email,
            subject: subject,
            html: message
        };

        const transporter = nodemailer.createTransport({
            host: configEmail.host,
            port: configEmail.port,
            secure: false,
            auth: {
                user: configEmail.user,
                pass: configEmail.password
            },
            tls: { rejectUnauthorized: false }
        });

        transporter.sendMail(emailOptions, function (error, info) {
            if (error) {
                console.log(error)
                // throw ResponseHandler(res, 400, 'Erro ao enviar email', error);
            } else {
                // throw ResponseHandler(res, 200, 'Email enviado', info);
                console.log("oi")
            }
        });
    }


}

export default new Email;