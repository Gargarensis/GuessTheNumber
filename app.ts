import express, { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { routes } from './routes/index';
import { HandledError } from './models/exceptions/HandledError';

const app = express();

const options: cors.CorsOptions = {
  methods: ['GET','POST']
};
app.use(cors(options));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1/', routes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err instanceof HandledError) {
    res.json({
      description: err.name + ' - ' + err.message
    }).status(err.httpCode).end();
  } else {
    console.error('Unhandled error: ' + err);
  }
});


module.exports = app;

