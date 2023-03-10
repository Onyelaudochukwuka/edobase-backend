"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.compare = exports.hashing = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const dotEnv = __importStar(require("dotenv"));
const node_crypto_1 = require("node:crypto");
const axios_1 = __importDefault(require("axios"));
const secret = process.env.SECRET_HASH;
if (!secret)
    throw new Error("Secret hash is missing");
dotEnv.config();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
if (!RAPIDAPI_KEY)
    throw new Error("Secret hash is missing");
function hashing(str) {
    if (typeof str === "string" && str.length > 0) {
        const hash = (0, node_crypto_1.createHmac)("sha256", secret || "")
            .update(str)
            .digest("hex");
        return hash;
    }
    else {
        return false;
    }
}
exports.hashing = hashing;
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
function sendMail({ to, subject, value }, callback) {
    (0, axios_1.default)({
        "method": "POST",
        "url": "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
        "headers": {
            "content-type": "application/json",
            "x-rapidapi-host": "rapidprod-sendgrid-v1.p.rapidapi.com",
            "x-rapidapi-key": RAPIDAPI_KEY !== null && RAPIDAPI_KEY !== void 0 ? RAPIDAPI_KEY : "",
            "accept": "application/json",
            "useQueryString": true
        }, "data": {
            "personalizations": [{
                    "to": [{
                            "email": to
                        }], "subject": subject
                }], "from": {
                "email": "udochukwukaonyela@gmail.com"
            }, "content": [{
                    "type": "text/html",
                    value,
                }]
        }
    })
        .then((json) => callback(false, json))
        .catch((err) => callback(true, err));
}
exports.sendMail = sendMail;
const compare = (str, hash) => hashing(str.toString()) === hash;
exports.compare = compare;
