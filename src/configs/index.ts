import dotenv from 'dotenv';

dotenv.config();

type ConfigProps = {
  API_KEY: string;
  BASE_URL: string;
  ENV: string;
  PORT: number;
  SERVICE_NAME: string;
  HASH_SECRET: string;
  EVENT_CLIENT_ID: string;
  EVENT_GROUP_ID: string;
  EVENT_BROKERS: string[];
};

export const CONFIG: ConfigProps = {
  API_KEY: process.env.API_KEY as string,
  BASE_URL: process.env.BASE_URL as string,
  ENV: process.env.ENV as string,
  PORT: Number(process.env.PORT),
  SERVICE_NAME: process.env.SERVICE_NAME as string,
  HASH_SECRET: process.env.HASH_SECRET as string,
  EVENT_CLIENT_ID: process.env.EVENT_CLIENT_ID as string,
  EVENT_GROUP_ID: process.env.EVENT_GROUP_ID as string,
  EVENT_BROKERS: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
};
