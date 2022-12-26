require('dotenv').config();
import { createHmac } from "node:crypto";
import nodemailer from "nodemailer";
import aws from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
const secret = process.env.SECRET_HASH;
if (!secret) throw new Error("Secret hash is missing");

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

function sendMail({ to, subject, text }: { to: string, subject: string, text: string }, callback: any): void {
  transporter.sendMail(
    {
      from: "udochukwukaonyela@gmail.com",
      to,
      subject,
      text,
    },
    (err, info) => {
      if (err) {
        callback(true, err);
      } else {
        callback(false, info);
      }
    }
  );
}

const compare = (str: string, hash: string): boolean => hashing(str.toString()) === hash;

export { hashing, compare, sendMail };
