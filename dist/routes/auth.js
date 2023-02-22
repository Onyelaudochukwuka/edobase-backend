"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
/* GET users listing. */
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email."), (0, express_validator_1.body)("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."), middleware_1.Validate, auth_1.login);
router.post("/sign-up", (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email."), (0, express_validator_1.body)("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."), (0, express_validator_1.body)("name").trim().not().isEmpty().withMessage("Name is required."), middleware_1.Validate, auth_1.signUp);
router.post("/forgot-password", (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email."), middleware_1.Validate, auth_1.forgotPassword);
router.post("/reset-password", (0, express_validator_1.body)("client_id").trim().not().isEmpty().withMessage("User ID is required."), (0, express_validator_1.body)("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."), middleware_1.Validate, auth_1.resetPassword);
router.post("/complete-sign-up", (0, express_validator_1.body)("client_id").trim().not().isEmpty().withMessage("User ID is required."), (0, express_validator_1.body)("gender").trim().not().isEmpty().withMessage("Gender is required."), (0, express_validator_1.body)("LGA").trim().not().isEmpty().withMessage("LGA is required."), (0, express_validator_1.body)("username").trim().not().isEmpty().withMessage("Username is required."), (0, express_validator_1.body)("phone").trim().not().isEmpty().withMessage("Phone is required."), middleware_1.Validate, auth_1.completeSignUp);
// router.get(
//   "/user-name",
// )
exports.default = router;
