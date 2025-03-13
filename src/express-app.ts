import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { Consumer, Producer } from 'kafkajs';

import { User, users } from './databases/schemas';
import { BaseRepository } from './repositories';
import routes from './routes';
import { BaseService } from './services';
import { BaseTransformer } from './transformers';
import { BaseRepositoryType } from './types/repositories.type';
import { BrokerMessage, Events, handleErrorWithLogger, httpLogger, logger } from './utils';

export const ExpressApp = async () => {
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  // 1st step: connect to the producer and consumer
  const producer = await BrokerMessage.connectProducer<Producer>();
  producer.on('producer.connect', () => {
    logger.info('producer connected');
  });

  const consumer = await BrokerMessage.connectConsumer<Consumer>();
  consumer.on('consumer.connect', () => {
    logger.info('consumer connected');
  });

  const baseRepo = new BaseService<User>(new BaseRepository(users), new BaseTransformer());

  // 2nd tep: subscribe to the topic or publish the message
  await BrokerMessage.subscribe((message) => {
    logger.info('Consumer received the message');
    // logger.info('Message received:');
    // logger.info(message);

    console.log('message.event', message.event);
    if (message.event === Events.CREATE_USER) {
      const data = message.data;
      const condition = { username: data.username, email: data.email };

      baseRepo.create(condition, data);
      logger.info('User successfully saved!');
    }
  }, 'UserEvents');

  app.use(routes);

  app.use('/', (req: Request, res: Response, _: NextFunction): any => {
    return res.status(200).json({ message: 'Server is up!' });
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction): any => {
    return handleErrorWithLogger(error, req, res, next);
  });

  return app;
};
