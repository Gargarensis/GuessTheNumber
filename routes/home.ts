import express, { Express, NextFunction, Request, Response } from 'express';

export const homeRouter = express.Router();

homeRouter.get('/favicon.ico', (req: Request, res: Response) => res.status(204));