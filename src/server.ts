import { CONFIG } from './configs';
import { ExpressApp } from './express-app';
import { handleUnCaughtException } from './utils/errors';
import { logger } from './utils/infra';

export const StartServer = async () => {
  const expressApp = await ExpressApp();
  expressApp.listen(CONFIG.PORT, () => {
    logger.info(`Listening to: ${CONFIG.PORT}`);
  });

  process.on('uncaughtException', async (error) => {
    handleUnCaughtException(error);
  });
};

StartServer().then(() => {
  logger.info(`Server is up!`);
});
