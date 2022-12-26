import express, {
  Application,
  Response,
  Request,
  NextFunction,
  RouterOptions,
  IRouter,
} from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signUp,
} from "../controllers/auth";
import { body } from "express-validator";
import { Validate } from "../middleware";
const router: IRouter = express.Router();

/* GET users listing. */
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password").trim().isLength({ min: 5 }),
  Validate,
  login
);
router.post(
  "/sign-up",
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty(),
  Validate,
  signUp
);
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Please enter a valid email."),
  Validate,
  forgotPassword
);
router.post(
  "/reset-password",
  body("user_id").trim().not().isEmpty(),
  body("password").trim().isLength({ min: 5 }),
  Validate,
  resetPassword
);

export default router;
