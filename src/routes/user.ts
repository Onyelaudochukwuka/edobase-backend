import express, { IRouter } from 'express';
import { getUser, getUserDetails } from "../controllers/user";
import { Validate, isAuthorized } from "../middleware";
import { param } from "express-validator";
const router: IRouter = express.Router();

/* GET home page. */
router.get(
    '/get-user/:id',
    param('id').trim().not().isEmpty().withMessage("User ID is required."),
    isAuthorized,
    Validate,
    getUser
);
router.get(
    '/get-user-details/:id',
    param('id').trim().not().isEmpty().withMessage("User ID is required."),
    Validate,
    getUserDetails
);

router.get('/', function (req, res) {
    res.json({ title: 'Express' });
});

export default router;
