import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

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

export { Validate };