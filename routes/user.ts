import express, { Express, NextFunction, Request, Response } from 'express';

export const userRouter = express.Router();

const BASE_ROUTE = '/users';

userRouter.get(BASE_ROUTE + '/postlogin', function(req: Request, res: Response, next: NextFunction) {
  if (req.query.targetURL) {
    res.redirect(req.query.targetURL as string);
  }
});