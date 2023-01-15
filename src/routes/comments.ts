import express, {  IRouter } from 'express';
import { Validate } from "../middleware";
const router: IRouter = express.Router();

/* GET home page. */
router.post('/', Validate);
export default router;
