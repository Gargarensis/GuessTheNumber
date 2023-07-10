import express, { NextFunction, Request, Response } from 'express';

export const userRouter = express.Router();

const BASE_ROUTE = '/users';

/*
  Reroute the user to a given 'targetURL' through query parameters.
  Otherwise, returns a 200.
*/
userRouter.get(BASE_ROUTE + '/postlogin', function(req: Request, res: Response, next: NextFunction) {
  if (req.query.targetURL) {
    res.redirect(req.query.targetURL as string);
  } else {
    res.status(200).end();
  }
});