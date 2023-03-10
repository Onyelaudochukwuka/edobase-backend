/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotEnv from "dotenv";
import { createHmac } from "node:crypto";
import nodemailer from 'nodemailer';
const secret = process.env.SECRET_HASH;
if (!secret) throw new Error("Secret hash is missing");
dotEnv.config();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
if (!RAPIDAPI_KEY) throw new Error("Secret hash is missing");

function hashing(str: string): string | false {
    if (typeof str === "string" && str.length > 0) {
        const hash = createHmac("sha256", secret || "")
            .update(str)
            .digest("hex");
        return hash;
    } else {
        return false;
    }
}
// `
// <div style='padding: 0;background-color: #FFDE4E;display: grid;place-items: center;font-family: 'Chivo Mono', monospace;'>
//   <h1 style='text-align: center;font-size: 35px;margin-bottom: 20px;'>EdoBase</h1>
//   <section style='background: white;width: 80%;margin: auto;height: fit-content;display: block;position: relative;padding: 25px;'>
//     <p style='font-weight: 700'> Dear [Name],</p>
//     <p>Thank you for signing up for our forum! We're excited to have you as a member of our community.<br />To complete your registration and activate your account, please click on the following link:</p>
//     <div><a href=''>[Confirmation Link]</a></div>
//     <div><code>The Link is valid for 24 hours <a href=''> Click here to generate another one</a></code></div>
//     <p>Once you've clicked on the link, your account will be activated and you'll be able to start participating in discussions and connecting with other members.</p>

//     <p>Thank you for joining us, and we look forward to seeing you on the forum!</p>
//   </section>
// </div>
// </body>
//     `
async function sendMail(
    { to, subject, value }: { to: string; subject: string; value: string },
    callback: any
): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'superdevmax@gmail.com',
            pass: 'qixrbhcsraffilpf',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const info = await transporter.sendMail({
        from: 'superdevmax@gmail.com',
        to,
        subject,
        html: value,
    });
    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    if (info.messageId) {
        callback(false, 'Success');
    } else {
        callback(true, 'Success');    
    }
}

const compare = (str: string, hash: string): boolean => hashing(str.toString()) === hash;


export { hashing, compare, sendMail };
