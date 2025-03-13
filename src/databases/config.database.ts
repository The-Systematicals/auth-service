import dotenv from 'dotenv';

dotenv.config();

export type DatabaseType = {
  service_name: string;
  hostname: string;
  port: number;
  username: string;
  password: string;
  database: string;
  url: string;
};

export const DATABASE: DatabaseType = {
  service_name: 'auth-service',
  hostname: process.env.AUTH_DB_HOST as string,
  port: Number(process.env.AUTH_DB_PORT),
  username: process.env.AUTH_DB_USER as string,
  password: process.env.AUTH_DB_PASSWORD as string,
  database: process.env.AUTH_DB_NAME as string,
  url: `postgresql://${process.env.AUTH_DB_USER}:${process.env.AUTH_DB_PASSWORD}@${process.env.AUTH_DB_HOST}:${process.env.AUTH_DB_PORT}/${process.env.AUTH_DB_NAME}`,
};
