import express from 'express';

import { User as Schema, users as table } from '../databases/schemas';
import { Dto } from '../dtos/user.request.dto';
import { BaseRepository } from '../repositories';
import { BaseService, UserService } from '../services';
import { BaseTransformer } from '../transformers';
import { baseRoutes } from './base.route';

const router = express.Router();

const service = new UserService(new BaseService<Schema>(new BaseRepository(table), new BaseTransformer()));

router.use(baseRoutes(service, Dto));

export default router;
