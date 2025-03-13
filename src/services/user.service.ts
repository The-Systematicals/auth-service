import { User as Schema } from '../databases/schemas';
import { UserServiceType } from '../types/services.type';
import { generateUUID, getDateTime, setPasswordToHash } from '../utils';
import { BaseService } from './base.service';

export class UserService implements UserServiceType {
  constructor(private baseService: BaseService<Schema>) {}

  async create(data: Partial<Schema>): Promise<Partial<Schema>> {
    const condition = { username: data.username, email: data.email };

    const finalData = {
      ...data,
      id: generateUUID(),
      createdAt: getDateTime(),
      updatedAt: getDateTime(),
      password: await setPasswordToHash(data.password),
    };

    return this.baseService.create(condition, finalData);
  }

  async find(condition: Record<string, any>): Promise<Partial<Schema>> {
    return this.baseService.find(condition);
  }

  async findAll(): Promise<Partial<Schema>[]> {
    return this.baseService.findAll();
  }

  async edit(condition: Record<string, any>, data: Partial<Schema>): Promise<Partial<Schema>> {
    return this.baseService.edit(condition, data);
  }

  async remove(id: string | number): Promise<boolean> {
    return this.baseService.remove(id);
  }

  async option(fieldSelected: keyof Schema, condition: Record<string, any>): Promise<Partial<Schema>[]> {
    return this.baseService.option(fieldSelected, condition);
  }
}
