import express, { Response, Request, NextFunction, IRouter } from 'express';
const router: IRouter = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
    res.json({ title: 'Express' });
});

export default router;
