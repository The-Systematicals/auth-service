import { User, users } from '../../databases/schemas';
import { BaseRepository } from '../../repositories';
import { BaseService } from '../../services';
import { BaseTransformer } from '../../transformers';
import { logger } from '../infra';
import { EventMessage } from './types.broker';

const baseRepo = new BaseService<User>(new BaseRepository(users), new BaseTransformer());

export const createUser = async (message: EventMessage) => {
  try {
    const data = message.data;
    const condition = { username: data.username, email: data.email };
    baseRepo.create(condition, data);
    logger.info('User successfully saved!');
  } catch (error) {
    logger.error(error);
  }
};

export const updateUser = async (message: EventMessage) => {
  try {
    const data = message.data;
    const condition = { id: data.id };
    baseRepo.edit(condition, data);
    logger.info('User successfully updated!');
  } catch (error) {
    logger.error(error);
  }
};

export const deleteUser = async (message: EventMessage) => {
  try {
    const data = message.data;
    baseRepo.remove(data.id);
    logger.info('User successfully removed!');
  } catch (error) {
    logger.error(error);
  }
};
