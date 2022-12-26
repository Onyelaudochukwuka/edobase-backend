import express, { Application, Response, Request, NextFunction, RouterOptions, IRouter } from 'express';
import { login, signUp } from "../controllers/auth";
const router: IRouter = express.Router();

/* GET users listing. */
router.post('/login', login);
router.post('/sign-up', signUp);

export default router;
