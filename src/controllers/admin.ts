import jwt from "jsonwebtoken";
import { compare } from "../helpers";
import { Request, Response } from "express";
import user from "../models/user";
interface Req extends Request {
  body: {
    email: string;
    password: string;
  };
}
const login = async (req: Req, res: Response) => {
  const { email, password } = req.body;
  const user = await user.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
    expiresIn: "1h",
  });
  res.json({ token, userId: user.id });
};