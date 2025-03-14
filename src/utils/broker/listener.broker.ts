import { Consumer, Producer } from 'kafkajs';

import { User, users } from '../../databases/schemas';
import { BaseRepository } from '../../repositories';
import { BaseService } from '../../services';
import { BaseTransformer } from '../../transformers';
import { logger } from '../infra';
import { createUser, deleteUser, updateUser } from './consumer.broker';
import { BrokerMessage, Events } from './index';

export const BrokerListener = async () => {
  const baseRepo = new BaseService<User>(new BaseRepository(users), new BaseTransformer());

  // 1st step: connect to the producer and consumer
  const producer = await BrokerMessage.connectProducer<Producer>();
  producer.on('producer.connect', () => {
    logger.info('producer connected');
  });

  const consumer = await BrokerMessage.connectConsumer<Consumer>();
  consumer.on('consumer.connect', () => {
    logger.info('consumer connected');
  });

  await BrokerMessage.subscribe((message) => {
    logger.info('Consumer received the message');

    console.log('message.event', message.event);
    if (message.event === Events.CREATE_USER) {
      createUser(message, baseRepo);
    }
    if (message.event === Events.UPDATE_USER) {
      updateUser(message, baseRepo);
    }
    if (message.event === Events.DELETE_USER) {
      deleteUser(message, baseRepo);
    }
  }, 'UserEvents');
};
