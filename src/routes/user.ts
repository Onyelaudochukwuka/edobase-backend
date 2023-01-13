import express, { IRouter } from 'express';
import { getUser } from "../controllers/user";
import { Validate } from "../middleware";
import { param } from "express-validator";
const router: IRouter = express.Router();

/* GET home page. */
router.get(
    '/get-user/:id',
    param('id').trim().not().isEmpty().withMessage("User ID is required."),
    Validate,
    getUser
);
router.get('/', function (req, res) {
    res.json({ title: 'Express' });
});
export default router;
