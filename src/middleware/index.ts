import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user";
const jwtSecret = process.env.JWT_SECRET ?? '';
if (!jwtSecret) throw new Error("Secret hash is missing");

async function isAuthorized(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
        verify(req.headers.authorization.split(' ')[1], jwtSecret, async (err: any, decoded: any) => {
            if (err) {
                console.log(err);
                res.status(401).json({ error: true, message: "Unauthorized" });
            }
            if (decoded) {
                const user = await User.findOne({ _id: decoded.userId });
                if (user.confirmed) {
                    next();
                } else {
                    res.status(401).json({ error: true, message: "Unauthorized" });
                }
            }
        });
    } else {
        res.status(401).send('Unauthorized');
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
}

export { Validate, isAuthorized };