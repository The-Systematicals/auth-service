import { TSchema } from '@sinclair/typebox';

import { NextFunction, Request, Response } from 'express';

import { handleRequest } from './handler.validator';

export const validateRequest = <T extends TSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      handleRequest(req.body, schema);
      next();
    } catch (error) {
      next(error);
    }
  };
};
