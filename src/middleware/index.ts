import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user";
interface Req extends Request {
  body: {
    email: string;
    password: string;
    name?: string;
    user_id?: string;
  };
  session?: any;
}
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("Secret hash is missing");

async function isAuthorized(req: Req, res: Response, next: NextFunction) {
  if (req.session) {
    verify(req.session.token, jwtSecret ?? '', async (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ error: true, message: "Unauthorized" });
      }
      if (decoded) {
        console.log(decoded.userId)
        const user = await User.findOne({ id: decoded.userId });
        if (user.confirmed) {
          next()
        } else {
          res.status(401).json({ error: true, message: "Unauthorized" });
        }
      }
    })
  } else {
    res.status(401).send('Unauthorized')
  }
}


function Validate( req: Request, res: Response, next: NextFunction ) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: "invalid request",
      data: errors.array()
    });
  } else {
    next();
  }
};

export { Validate, isAuthorized };