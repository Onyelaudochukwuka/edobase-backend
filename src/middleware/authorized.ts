import { NextFunction, Request, Response } from "express"

function Authrorized(req: Request, res: Response, next: NextFunction) {
  if (req.session) {
    console.log(req.session);
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}