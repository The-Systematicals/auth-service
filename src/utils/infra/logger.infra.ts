import pino from 'pino';
import { pinoHttp } from 'pino-http';

import { CONFIG } from '../../configs';

export const logger = pino({
  level: 'info',
  base: { serviceName: CONFIG.SERVICE_NAME },
  timestamp: () => {
    const now = new Date();
    return `,"time":"${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('en-US', { hour12: false })}"`;
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      ignore: 'hostname,pid',
    },
  },
});

export const httpLogger = pinoHttp({
  level: 'error',
  logger,
});
