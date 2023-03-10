"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeSignUp = exports.forgotPassword = exports.resetPassword = exports.signUp = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const helpers_1 = require("../helpers");
const user_1 = __importDefault(require("../models/user"));
const pass_1 = __importDefault(require("../models/pass"));
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret)
    throw new Error("Secret hash is missing");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = (yield user_1.default.findOne({ email }));
    if (!user) {
        return res.status(400).json({ error: true, message: "User not found" });
    }
    const isMatch = yield (0, helpers_1.compare)(password, user.password);
    if (!isMatch) {
        return res
            .status(400)
            .json({ error: true, message: "Incorrect Credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret || "", {
        expiresIn: "30d",
    });
    res.json({ error: false, token, userId: user._id });
});
exports.login = login;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line prefer-const
    let { email, password, name } = req.body;
    const user = yield user_1.default.findOne({
        email,
    });
    if (user) {
        return res
            .status(400)
            .json({ error: true, message: "User already exists" });
    }
    password = (yield (0, helpers_1.hashing)(password));
    if (password) {
        const newUser = new user_1.default({
            email,
            password,
            name,
        });
        yield newUser.save();
        const confirmation_id = (0, uuid_1.v4)();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const pass = new pass_1.default({
            user_id: newUser._id,
            confirmation_id,
            date: Date.now() + ONE_DAY,
        });
        yield pass.save();
        (0, helpers_1.sendMail)({
            to: email,
            subject: "Password Reset",
            value: "<div style='padding: 0;background-color: #FFDE4E;display: grid;place-items: center;font-family: 'Chivo Mono', monospace;'><h1 style='text-align: center;font-size: 35px;margin-bottom: 20px;'>EdoBase</h1><section style='background: white;width: 80%;margin: auto;height: fit-content;display: block;position: relative;padding: 25px;'><p style='font-weight: 700'> Dear " +
                name +
                ",</p><p>Thank you for signing up for our forum! We're excited to have you as a member of our community.<br />To complete your registration and activate your account, please click on the following link:</p><div><a href='https:edobase.vercel.app/complete?client_id=" +
                confirmation_id +
                "'>https:edobase.vercel.app/complete?client_id=" +
                confirmation_id +
                "</a></div><div><code>The Link is valid for 24 hours <a href=''> Click here to generate another one</a></code></div><p>Once you've clicked on the link, your account will be activated and you'll be able to start participating in discussions and connecting with other members.</p><p>Thank you for joining us, and we look forward to seeing you on the forum!</p></section></div></body>",
        }, (err, info) => {
            if (err) {
                res
                    .status(500)
                    .json({ error: true, message: "Something went wrong" + info });
            }
            else {
                res.status(200).json({
                    error: false,
                    message: "Check Your Email For A confirmation Link",
                });
            }
        });
    }
    else {
        res.status(400).json({ error: true, message: "Something went wrong" });
    }
});
exports.signUp = signUp;
const completeSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { client_id, gender, LGA, username, phone, bio } = req.body;
    pass_1.default.find({ date: { $lt: Date.now() } }).then((data) => {
        data.forEach((pass) => {
            console.log(pass);
        });
    });
    const pass = yield pass_1.default.findOne({
        confirmation_id: client_id,
    });
    if (!pass) {
        return res.status(400).json({ error: true, message: "User not found" });
    }
    else {
        pass.delete();
        if (pass.date < Date.now()) {
            return res.status(400).json({ error: true, message: "Link Expired" });
        }
        else {
            const user = yield user_1.default.findOne({
                _id: pass.user_id,
            });
            if (!user) {
                return res.status(400).json({ error: true, message: "User not found" });
            }
            else {
                if (user.confirmed) {
                    return res
                        .status(400)
                        .json({ error: true, message: "User already verified" });
                }
                else {
                    user.gender = gender;
                    user.LGA = LGA;
                    user.username = username;
                    user.phone = phone;
                    user.confirmed = true;
                    user.bio = bio;
                    yield user.save();
                    const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret || "", {
                        expiresIn: "30d",
                    });
                    return res
                        .status(200)
                        .json({
                        error: false,
                        message: "Account Verified",
                        token,
                        userId: user._id,
                    });
                }
            }
        }
    }
});
exports.completeSignUp = completeSignUp;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: true, message: "User not found" });
    }
    else {
        const confirmation_id = (0, uuid_1.v4)();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const pass = new pass_1.default({
            user_id: user._id,
            confirmation_id,
            date: Date.now() + ONE_DAY,
        });
        yield pass.save();
        (0, helpers_1.sendMail)({
            to: email,
            subject: "Password Reset",
            value: `
<div style='padding: 0;background-color: #FFDE4E;display: grid;place-items: center;font-family: 'Chivo Mono', monospace;'>
  <h1 style='text-align: center;font-size: 35px;margin-bottom: 20px;'>EdoBase</h1>
  <section style='background: white;width: 80%;margin: auto;height: fit-content;display: block;position: relative;padding: 25px;'>
    <p style='font-weight: 700'> Dear [Name],</p>
    <p>Follow this <a>link</a> to reset your password</p>
    <div><a href='https:edobase.vercel.app/reset-password?client_id${confirmation_id}'>https:edobase.vercel.app/resetPassword?client_id${confirmation_id}"</a></div>
    <p>Thank you for joining us, and we look forward to seeing you on the forum!</p>
  </section>
</div>
</body>
    `,
        }, (err, info) => {
            if (err) {
                res.status(500).json({ error: true, message: info.message });
            }
            else {
                res
                    .status(200)
                    .json({ error: false, message: "Password reset link sent" });
            }
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { client_id, password } = req.body;
    const pass = yield pass_1.default.findOne({
        confirmation_id: client_id,
    });
    if (!pass) {
        return res
            .status(400)
            .json({ error: true, message: "Link Has Been Already Used" });
    }
    else {
        if (pass.date < Date.now()) {
            return res.status(400).json({ error: true, message: "Link Expired" });
        }
        else {
            const user = yield user_1.default.findOne({
                _id: pass.user_id,
            });
            pass.delete();
            if (!user) {
                return res.status(400).json({ error: true, message: "User not found" });
            }
            else {
                if (user.confirmed) {
                    const hashedPassword = (yield (0, helpers_1.hashing)(password));
                    if (hashedPassword) {
                        user.password = hashedPassword;
                        yield user.save();
                        res
                            .status(200)
                            .json({ error: false, message: "Password reset successful" });
                    }
                    else {
                        res
                            .status(400)
                            .json({ error: true, message: "Something went wrong" });
                    }
                }
                else {
                    return res
                        .status(400)
                        .json({ error: true, message: "User already verified" });
                }
            }
        }
    }
});
exports.resetPassword = resetPassword;
