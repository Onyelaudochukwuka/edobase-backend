import express, { Response, Request, NextFunction, IRouter } from 'express';
import { Validate, isAuthorized } from "../middleware";
const router: IRouter = express.Router();

/* GET home page. */
router.post('/', isAuthorized, Validate);
export default router;
