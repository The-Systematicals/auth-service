import { NextFunction, Request, Response, Router } from 'express';

import { users } from '../databases/schemas';
import { Dto } from '../dtos/authentication.request.dto';
import { BaseRepository } from '../repositories';
import { AuthenticationService } from '../services';
import { HTTP_SUCCESS, SUCCESS, handleSuccess, validateRequest } from '../utils';

const router = Router();

const service = new AuthenticationService(new BaseRepository(users));

router.post('/login', validateRequest(Dto.login), (req: Request, res: Response, next: NextFunction) => {
  try {
    service
      .login(req.body)
      .then((data) => handleSuccess(res, HTTP_SUCCESS.OK, SUCCESS(req).LoggedIn, data))
      .catch(next);
  } catch (error) {
    next(error);
  }
});

export default router;
