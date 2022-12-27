import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { compare, hashing, sendMail } from "../helpers";
import { Request, Response } from "express";
import User, { IUser } from "../models/user";
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("Secret hash is missing");
interface Req extends Request {
  body: {
    email: string;
    password: string;
    name?: string;
    user_id?: string;
  };
  session?: any;
}
const login = async (req: Req, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }) as IUser;
  if (!user) {
    return res.status(400).json({  error: true, message: "User not found" });
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({  error: true, message: "Incorrect password" });
  }
  const token = jwt.sign({ userId: user.id }, jwtSecret || "", {
    expiresIn: "30d",
  });
  req.session.token = token;
  res.json({ error: false, token, userId: user.id });
};

const signUp = async (req: Req, res: Response) => {
  let { email, password, name } = req.body;
  console.log(req.session);
  const user = await User.findOne({
    email,
  });
  if (user) {
    return res.status(400).json({ error: true, message: "User already exists" });
  }
  const id: string = uuidv4();
  password = await hashing(password) as string;
  console.log(id);
  if (password) {
    const newUser = new User({
      email,
      password,
      name,
      id
    });
    await newUser.save();
    const token = jwt.sign({
      userId: newUser
    }, jwtSecret,
      {
        expiresIn: "30d"
      }
    );
    res.status(201).json({ error: false, token, userId: newUser.id });
  } else {
    res.status(400).json({ error: true, message: "Something went wrong" });
  }
};

const forgotPassword = async (req: Req, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: true, message: "User not found" });
  } else {
    sendMail({
      to: email,
      subject: "Password Reset",
      text: "I hope this message gets sent!",
    }, (err: any, info: any) => {
      if (err) {
        res.status(500).json({ error: true, message: "Something went wrong" });
      }
      else {
        res.status(200).json({ error: false, message: "Password reset link sent" });
      }
    })
  }
}

const resetPassword = async (req: Req, res: Response) => {
  const { user_id, password } = req.body;
  const user = await User.findOne({
    id: user_id,
  });
  if (!user) {
    return res.status(400).json({ error: true, message: "User not found" });
  }
  const hashedPassword = await hashing(password) as string;
  if (hashedPassword) {
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ error: false, message: "Password reset successful" });
  } else {
    res.status(400).json({ error: true, message: "Something went wrong" });
  }
}

export { login, signUp, resetPassword, forgotPassword };
