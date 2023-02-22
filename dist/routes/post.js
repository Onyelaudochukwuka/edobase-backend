"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../controllers/post");
const express_validator_1 = require("express-validator");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', post_1.home);
router.post('/create-post', (0, express_validator_1.body)('title').trim().not().isEmpty().withMessage('Title is required.'), (0, express_validator_1.body)('content').trim().not().isEmpty().withMessage('Content is required.'), (0, express_validator_1.body)('author').trim().not().isEmpty().withMessage('Author is required.'), (0, express_validator_1.body)('topic').trim().not().isEmpty().withMessage('Topic is required.'), middleware_1.Validate, middleware_1.isAuthorized, post_1.create);
router.post('/update/:id', (0, express_validator_1.param)('id').trim().not().isEmpty().withMessage('ID is required.'), middleware_1.Validate, post_1.update);
router.get('/get-post/:id', (0, express_validator_1.param)('id').trim().not().isEmpty().withMessage('ID is required.'), middleware_1.Validate, post_1.getPost);
router.get('/get-category/:category', (0, express_validator_1.param)('category').trim().not().isEmpty().withMessage('ID is required.'), middleware_1.Validate, post_1.getCategory);
router.get('/search/:query', post_1.getSearch);
router.get('/trending', post_1.getTrending);
router.get('/recent', post_1.getRecent);
exports.default = router;
