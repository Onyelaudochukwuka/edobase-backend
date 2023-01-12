import express, { IRouter } from 'express';
import { create, home } from "../controllers/post";
import { body, param } from "express-validator";
import { Validate, isAuthorized } from "../middleware";
const router: IRouter = express.Router();

/* GET home page. */
router.get('/', home);

router.post('/create',
    body('title').trim().not().isEmpty().withMessage('Title is required.'),
    body('content').trim().not().isEmpty().withMessage('Content is required.'),
    body('author').trim().not().isEmpty().withMessage('Author is required.'),
    Validate,
    isAuthorized,
    create
);

router.post('/update/:id',
    body('title').trim().not().isEmpty().withMessage('Title is required.'),
    body('content').trim().not().isEmpty().withMessage('Content is required.'),
    body('author').trim().not().isEmpty().withMessage('Author is required.'),
    body('promoted').trim().not().isEmpty().withMessage('Promoted is required.'),
    param('id').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    isAuthorized,
    create
);

router.get('/get-post/:id',
    param('id').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    isAuthorized,
    create
);

export default router;
