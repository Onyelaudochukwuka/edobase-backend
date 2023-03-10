import express, { IRouter } from 'express';
import { create, getCategory, getPost, getRecent, getSearch, getTrending, home, update, DeletePost } from "../controllers/post";
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

router.get('/update/:id',
    param('id').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    update,
);
router.get('/update/:id',
    param('id').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    DeletePost,
);
router.get('/get-post/:id',
    param('id').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    getPost,
);
router.get('/get-category/:category',
    param('category').trim().not().isEmpty().withMessage('ID is required.'),
    Validate,
    getCategory,
);
router.get('/search/:query', getSearch);
router.get('/trending', getTrending);
router.get('/recent', getRecent);

export default router;
