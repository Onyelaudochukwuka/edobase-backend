"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const middleware_1 = require("../middleware");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
/* GET home page. */
router.get('/get-user/:id', (0, express_validator_1.param)('id').trim().not().isEmpty().withMessage("User ID is required."), middleware_1.isAuthorized, middleware_1.Validate, user_1.getUser);
router.get('/get-user-details/:id', (0, express_validator_1.param)('id').trim().not().isEmpty().withMessage("User ID is required."), middleware_1.Validate, user_1.getUserDetails);
router.get('/', function (req, res) {
    res.json({ title: 'Express' });
});
exports.default = router;
