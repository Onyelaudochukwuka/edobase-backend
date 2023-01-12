import express, { Response, Request, IRouter } from 'express';
const router: IRouter = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response) {
    res.json({ title: 'Express' });
});

export default router;
