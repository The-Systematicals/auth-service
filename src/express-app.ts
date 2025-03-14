import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import routes from './routes';
import { BrokerListener, handleErrorWithLogger, httpLogger } from './utils';

export const ExpressApp = async () => {
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);
  // await BrokerListener();
  app.use(routes);

  app.use('/', (req: Request, res: Response, _: NextFunction): any => {
    return res.status(200).json({ message: 'Server is up!' });
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction): any => {
    return handleErrorWithLogger(error, req, res, next);
  });

  return app;
};
