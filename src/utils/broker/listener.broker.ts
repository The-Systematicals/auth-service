import { Consumer, Producer } from 'kafkajs';

import { logger } from '../infra';
import { createUser, deleteUser, updateUser } from './consumer.broker';
import { BrokerMessage, Events } from './index';

export const BrokerListener = async () => {
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
      createUser(message);
    }
    if (message.event === Events.UPDATE_USER) {
      updateUser(message);
    }
    if (message.event === Events.DELETE_USER) {
      deleteUser(message);
    }
  }, 'UserEvents');
};
