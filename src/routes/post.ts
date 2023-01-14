import express, { IRouter } from 'express';
import { create, getCategory, getPost, home, update } from "../controllers/post";
import { body, param } from "express-validator";
import { Validate, isAuthorized } from "../middleware";
const router: IRouter = express.Router();

/* GET home page. */
router.get('/', home);

router.post('/create-post',
    body('title').trim().not().isEmpty().withMessage('Title is required.'),
    body('content').trim().not().isEmpty().withMessage('Content is required.'),
    body('author').trim().not().isEmpty().withMessage('Author is required.'),
    body('topic').trim().not().isEmpty().withMessage('Topic is required.'),
    Validate,
    isAuthorized,
    create
);

router.post('/update/:id',
    param('id').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    isAuthorized,
    update,
);
router.get('/get-post/:id',
    param('id').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    isAuthorized,
    getPost,
);
router.get('/get-category/:category',
    param('category').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    isAuthorized,
    getCategory,
);

export default router;
