import express, { Application, Response, Request, NextFunction, RouterOptions, IRouter } from 'express';
const router: IRouter = express.Router();
/* GET users listing. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

export default router;
