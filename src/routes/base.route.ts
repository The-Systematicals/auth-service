import { TObject } from '@sinclair/typebox';

import { NextFunction, Request, Response, Router } from 'express';

import { BaseSchemaType } from '../types/services.type';
import { HTTP_SUCCESS, SUCCESS, getDefaultSelectCond, handleSuccess, validateRequest } from '../utils';

export const baseRoutes = <T>(
  service: BaseSchemaType<T>,
  validationSchema: Record<'create' | 'edit' | 'findAll', TObject>,
  routeName: string = '',
): Router => {
  const router = Router();

  // Create
  router.post(
    '/create',
    validateRequest(validationSchema.create),
    (req: Request, res: Response, next: NextFunction) => {
      service
        .create(req.body)
        .then((data) => handleSuccess(res, HTTP_SUCCESS.CREATED, SUCCESS(req, routeName).Created, data))
        .catch(next);
    },
  );

  // Find by ID
  router.get('/find/:id', (req: Request, res: Response, next: NextFunction) => {
    service
      .find({ id: req.params.id })
      .then((data) => handleSuccess(res, HTTP_SUCCESS.OK, SUCCESS(req, routeName).Found, data))
      .catch(next);
  });

  // Find All
  router.get('/findAll', (req: Request, res: Response, next: NextFunction) => {
    service
      .findAll()
      .then((data) => handleSuccess(res, HTTP_SUCCESS.OK, SUCCESS(req, routeName).FoundAll, data, data.length))
      .catch(next);
  });

  // Edit
  router.patch(
    '/edit/:id',
    validateRequest(validationSchema.edit),
    (req: Request, res: Response, next: NextFunction) => {
      service
        .edit({ id: req.params.id }, req.body)
        .then((data) => handleSuccess(res, HTTP_SUCCESS.OK, SUCCESS(req, routeName).Edited, data))
        .catch(next);
    },
  );

  // Remove
  router.patch('/remove/:id', (req: Request, res: Response, next: NextFunction) => {
    service
      .remove(req.params.id)
      .then(() => handleSuccess(res, HTTP_SUCCESS.OK, SUCCESS(req, routeName).Removed, null))
      .catch(next);
  });

  // Find All
  router.get('/option', (req: Request, res: Response, next: NextFunction) => {
    service
      .option(getDefaultSelectCond(req).selected, getDefaultSelectCond(req).cond)
      .then((data) => handleSuccess(res, HTTP_SUCCESS.OK, SUCCESS(req, routeName).FoundAll, data, data.length))
      .catch(next);
  });

  return router;
};
