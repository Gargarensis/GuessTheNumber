import express from 'express';
import { homeRouter } from './home';
import { userRouter } from './user';
import { gameRouter } from './game';

export const routes = express.Router();

routes.use(homeRouter);
routes.use(userRouter);
routes.use(gameRouter);