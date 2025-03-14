import { Consumer, Kafka, LogEntry, Partitioners, Producer, logCreator, logLevel } from 'kafkajs';

import { CONFIG } from '../../configs';
import { logger } from '../infra';
import { EventMessage, EventTopics, Events, MessageBroker, MessageHandler, Publish } from './types.broker';

const kafkaLogCreator: logCreator = () => (entry: LogEntry) => {
  const levels: { [key in logLevel.WARN | logLevel.INFO]: 'warn' | 'info' } = {
    [logLevel.WARN]: 'warn',
    [logLevel.INFO]: 'info',
  };

  const logMethod = levels[entry.level as logLevel.WARN | logLevel.INFO] || 'info';
  logger[logMethod](entry.log);
};

export const kafka = new Kafka({
  clientId: CONFIG.EVENT_CLIENT_ID,
  brokers: CONFIG.EVENT_BROKERS.length ? CONFIG.EVENT_BROKERS : ['localhost:9092'],
  logLevel: logLevel.INFO,
  logCreator: kafkaLogCreator,
});

let producer: Producer;
let consumer: Consumer;

const createTopic = async (topic: string[]) => {
  const topics = topic.map((t) => ({
    topic: t,
    numPartitions: 2,
    replicationFactor: 1,
  }));

  const admin = kafka.admin();
  await admin.connect();
  const topicExists = await admin.listTopics();

  for (const t of topics) {
    if (!topicExists.includes(t.topic)) {
      await admin.createTopics({
        topics: [t],
      });
    }
  }

  await admin.disconnect();
};

const connectProducer = async <T>(): Promise<T> => {
  await createTopic(['UserEvents']);

  if (producer) {
    logger.info('Producer already connected with existing connection');
    return producer as unknown as T;
  }

  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();
  logger.info('Producer connected with new connection');
  return producer as unknown as T;
};

const disconnectProducer = async (): Promise<void> => {
  if (producer) {
    await producer.disconnect();
  }
};

const publish = async (data: Publish): Promise<boolean> => {
  const producer = await connectProducer<Producer>();
  const result = await producer.send({
    topic: data.topic,
    messages: [
      {
        headers: data.headers,
        key: data.event,
        value: JSON.stringify(data.message),
      },
    ],
  });

  logger.info('User Data successfully sent to Auth service!');

  return result.length > 0;
};

const connectConsumer = async <T>(): Promise<T> => {
  if (consumer) {
    return consumer as unknown as T;
  }

  consumer = kafka.consumer({
    groupId: CONFIG.EVENT_GROUP_ID,
  });

  await consumer.connect();
  return consumer as unknown as T;
};

const disconnectConsumer = async (): Promise<void> => {
  if (consumer) {
    await consumer.disconnect();
  }
};

const subscribe = async (messageHandler: MessageHandler, topic: EventTopics): Promise<void> => {
  const consumer = await connectConsumer<Consumer>();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== 'UserEvents') {
        return;
      }

      if (message.key && message.value) {
        const inputMessage: EventMessage = {
          headers: message.headers,
          event: message.key.toString() as Events,
          data: message.value ? JSON.parse(message.value.toString()) : null,
        };

        await messageHandler(inputMessage);
        await consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }]);
      }
    },
  });
};

export const BrokerMessage: MessageBroker = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  disconnectConsumer,
  subscribe,
};
