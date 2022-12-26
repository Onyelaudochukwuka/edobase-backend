import express, { IRouter } from "express";
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
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
  Validate,
  login
);
router.post(
  "/sign-up",
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
  body("name").trim().not().isEmpty().withMessage("Name is required."),
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
  body("user_id").trim().not().isEmpty().withMessage("User ID is required."),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
  Validate,
  resetPassword
);

export default router;
