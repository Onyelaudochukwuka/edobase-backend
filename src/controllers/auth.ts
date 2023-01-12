import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { compare, hashing, sendMail } from "../helpers";
import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import Pass from "../models/pass";
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("Secret hash is missing");
interface Req extends Request {
  body: {
    email: string;
    password: string;
    name?: string;
    user_id?: string;
    client_id?: string;
    LGA?: string;
    phone?: string;
    gender?: string;
    description?: string;
    username?: string;
  };
  session?: any;
}
const login = async (req: Req, res: Response) => {
    const { email, password } = req.body;
    const user = (await User.findOne({ email })) as IUser;
    if (!user) {
        return res.status(400).json({ error: true, message: "User not found" });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: true, message: "Incorrect Credentials" });
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret || "", {
        expiresIn: "30d",
    });
    res.json({ error: false, token, userId: user.id });
};

const signUp = async (req: Req, res: Response) => {
    // eslint-disable-next-line prefer-const
    let { email, password, name } = req.body;
    const user = await User.findOne({
        email,
    });
    if (user) {
        return res
            .status(400)
            .json({ error: true, message: "User already exists" });
    }
    const id: string = uuidv4();
    password = (await hashing(password)) as string;
    console.log(id);
    if (password) {
        const newUser = new User({
            email,
            password,
            name,
            id,
        });
        await newUser.save();
        const confirmation_id = uuidv4();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const pass = new Pass({
            user_id: id,
            confirmation_id,
            date: Date.now() + ONE_DAY,
        });
        await pass.save();
        sendMail(
            {
                to: email,
                subject: "Password Reset",
                value: "<div style='padding: 0;background-color: #FFDE4E;display: grid;place-items: center;font-family: 'Chivo Mono', monospace;'><h1 style='text-align: center;font-size: 35px;margin-bottom: 20px;'>Edobase</h1><section style='background: white;width: 80%;margin: auto;height: fit-content;display: block;position: relative;padding: 25px;'><p style='font-weight: 700'> Dear " + name + ",</p><p>Thank you for signing up for our forum! We're excited to have you as a member of our community.<br />To complete your registration and activate your account, please click on the following link:</p><div><a href='https://edobase.vercel.app/complete?client_id="+ confirmation_id +"'>https://edobase.vercel.app/complete?client_id=" + confirmation_id + "</a></div><div><code>The Link is valid for 24 hours <a href=''> Click here to generate another one</a></code></div><p>Once you've clicked on the link, your account will be activated and you'll be able to start participating in discussions and connecting with other members.</p><p>Thank you for joining us, and we look forward to seeing you on the forum!</p></section></div></body>",
            },
            (err: any, info: any) => {
                if (err) {
                    res
                        .status(500)
                        .json({ error: true, message: "Something went wrong" + info });
                } else {
                    res
                        .status(200)
                        .json({
                            error: false,
                            message: "Check Your Email For A confirmation Link",
                        });
                }
            }
        );
    } else {
        res.status(400).json({ error: true, message: "Something went wrong" });
    }
};

const completeSignUp = async (req: Req, res: Response) => {
    const { client_id, gender, LGA, username, phone } = req.body;
    const pass = await Pass.findOne({
        confirmation_id: client_id,
    });
    if (!pass) {
        return res.status(400).json({ error: true, message: "User not found" });
    } else {
        pass.delete();
        if (pass.date < Date.now()) {
            return res.status(400).json({ error: true, message: "Link Expired" });
        } else {
            const user = await User.findOne({
                id: pass.user_id,
            });
            if (!user) {
                return res.status(400).json({ error: true, message: "User not found" });
            } else {
                console.log(user.confirmed);
                if (user.confirmed) {
                    return res
                        .status(400)
                        .json({ error: true, message: "User already verified" });
                } else {
                    user.gender = gender;
                    user.LGA = LGA;
                    user.username = username;
                    user.phone = phone;
                    user.confirmed = true;
                    await user.save();
                    const token = jwt.sign({ userId: user.id }, jwtSecret || "", {
                        expiresIn: "30d",
                    });
                    return res
                        .status(200)
                        .json({ error: false, message: "Account Verified", token });
                }
            }
        }
    }
};

const forgotPassword = async (req: Req, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
        return res.status(400).json({ error: true, message: "User not found" });
    } else {
        const confirmation_id = uuidv4();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const pass = new Pass({
            user_id: user.id,
            confirmation_id,
            date: Date.now() + ONE_DAY,
        });
        await pass.save();
        sendMail(
            {
                to: email,
                subject: "Password Reset",
                value: `
<div style='padding: 0;background-color: #FFDE4E;display: grid;place-items: center;font-family: 'Chivo Mono', monospace;'>
  <h1 style='text-align: center;font-size: 35px;margin-bottom: 20px;'>Edobase</h1>
  <section style='background: white;width: 80%;margin: auto;height: fit-content;display: block;position: relative;padding: 25px;'>
    <p style='font-weight: 700'> Dear [Name],</p>
    <p>Follow this <a>link</a> to reset your password</p>
    <div><a href='https://edobase.vercel.app/reset-password?client_id${confirmation_id}'>https://edobase.vercel.app/resetPassword?client_id${confirmation_id}"</a></div>
    <p>Thank you for joining us, and we look forward to seeing you on the forum!</p>
  </section>
</div>
</body>
    `,
            },
            (err: any, info: any) => {
                if (err) {
                    res
                        .status(500)
                        .json({ error: true, message: info.message });
                } else {
                    res
                        .status(200)
                        .json({ error: false, message: "Password reset link sent" });
                }
            }
        );
    }
};

const resetPassword = async (req: Req, res: Response) => {
    const { client_id, password } = req.body;
    const pass = await Pass.findOne({
        confirmation_id: client_id,
    });
    if (!pass) {
        return res.status(400).json({ error: true, message: "Link Has Been Already Used" });
    } else {
        if (pass.date < Date.now()) {
            return res.status(400).json({ error: true, message: "Link Expired" });
        } else {
            const user = await User.findOne({
                id: pass.user_id,
            });
            pass.delete();
            if (!user) {
                return res.status(400).json({ error: true, message: "User not found" });
            } else {
                if (user.confirmed) {
                    const hashedPassword = (await hashing(password)) as string;
                    if (hashedPassword) {
                        user.password = hashedPassword;
                        await user.save();
                        res
                            .status(200)
                            .json({ error: false, message: "Password reset successful" });
                    } else {
                        res.status(400).json({ error: true, message: "Something went wrong" });
                    }
                } else {
                    return res
                        .status(400)
                        .json({ error: true, message: "User already verified" });
                }
            }
        }
    }
};

export { login, signUp, resetPassword, forgotPassword, completeSignUp };
