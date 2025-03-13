export enum Events {
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
}

export type EventTopics = 'UserEvents'; // redudant first

export type EventMessage = {
  headers?: Record<string, any>;
  event: Events;
  data: Record<string, any>;
};

export type MessageHandler = (input: EventMessage) => void;

export type MessageBroker = {
  // producer
  connectProducer: <T>() => Promise<T>;
  disconnectProducer: () => Promise<void>;
  publish: (data: Publish) => Promise<boolean>;
  // consumer
  connectConsumer: <T>() => Promise<T>;
  disconnectConsumer: () => Promise<void>;
  subscribe: (messageHandler: MessageHandler, topic: EventTopics) => Promise<void>;
};

export type Publish = {
  headers: Record<string, any>;
  topic: EventTopics;
  event: Events;
  message: Record<string, any>;
};
