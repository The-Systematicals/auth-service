import { NextFunction, Request, Response } from 'express';

import { logger } from '../infra/logger.infra';
import { ErrorConflict, ErrorNotFound, ErrorUnauthorized, ErrorValidation } from './logger.error';

export const handleErrorWithLogger = <T>(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<T, Record<string, T>> => {
  let status = 500;
  let message = 'Internal Server Error';
  let details = null;

  if (error instanceof ErrorValidation) {
    status = error.status;
    message = error.message;
    details = error.errors || null; // Include validation details
  } else if (
    error instanceof ErrorNotFound ||
    error instanceof ErrorValidation ||
    error instanceof ErrorUnauthorized ||
    error instanceof ErrorConflict
  ) {
    status = error.status;
    message = error.message;
  }

  if (status === 500) {
    logger.error(error.stack || error);
  } else {
    logger.warn(error.message);
  }

  return res.status(status).json(details ? { error: message, details } : { error: message });
};

export const handleUnCaughtException = async (error: Error) => {
  // error report / monitoring tools
  logger.error(error);
  // recover
  process.exit(1);
};
