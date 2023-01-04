require("dotenv").config();
import { createHmac } from "node:crypto";
import nodemailer from "nodemailer";
import aws from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import axios from "axios";
import fetch from "node-fetch";
const request = require("request");
const secret = process.env.SECRET_HASH;
if (!secret) throw new Error("Secret hash is missing");
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
if (!RAPIDAPI_KEY) throw new Error("Secret hash is missing");

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: { aws },
});

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
//   <h1 style='text-align: center;font-size: 35px;margin-bottom: 20px;'>Edobase</h1>
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
function sendMail(
  { to, subject, value }: { to: string; subject: string; value: string },
  callback: any
): void {
  const url = "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send";
  const data = {
    personalizations: [
      { to: [{ email: to }], subject: subject },
    ],
    from: { email: "udochukwukaonyela@gmail.com" },
    content: [{ type: "text/html", value }],
  };
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": RAPIDAPI_KEY ?? "",
      "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => callback(false, json))
    .catch((err) => callback(true, err));
}

const compare = (str: string, hash: string): boolean =>
  hashing(str.toString()) === hash;

export { hashing, compare, sendMail };
