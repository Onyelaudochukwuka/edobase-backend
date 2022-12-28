import express, { Response, Request, NextFunction, IRouter } from 'express';
import { isAuthorized } from "../middleware";
const router: IRouter = express.Router();

/* GET home page. */
router.get('/', isAuthorized, function (req: Request, res: Response , next: NextFunction) {
  res.json({ title: 'Express' });
});

export default router;
