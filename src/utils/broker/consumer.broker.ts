import { User } from '../../databases/schemas';
import { BaseServiceType } from '../../types/services.type';
import { logger } from '../infra';
import { EventMessage } from './types.broker';

export const createUser = async (message: EventMessage, baseRepo: BaseServiceType<User>) => {
  try {
    const data = message.data;
    const condition = { username: data.username, email: data.email };
    baseRepo.create(condition, data);
    logger.info('User successfully saved!');
  } catch (error) {
    logger.error(error);
  }
};

export const updateUser = async (message: EventMessage, baseRepo: BaseServiceType<User>) => {
  try {
    const data = message.data;
    const condition = { id: data.id };
    baseRepo.edit(condition, data);
    logger.info('User successfully updated!');
  } catch (error) {
    logger.error(error);
  }
};

export const deleteUser = async (message: EventMessage, baseRepo: BaseServiceType<User>) => {
  try {
    const data = message.data;
    baseRepo.remove(data.id);
    logger.info('User successfully removed!');
  } catch (error) {
    logger.error(error);
  }
};
