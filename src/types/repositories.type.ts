import { NewUser, User } from '../databases/schemas';

export type BaseRepositoryType<T> = {
  insert(data: Partial<T>): Promise<T>;
  select(condition: Record<string, any>): Promise<T>;
  selectAll(): Promise<T[]>;
  update(condition: Record<string, any>, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  selectOption(fieldSelected: keyof T, condition: Record<string, any>): Promise<T[]>;
};

export type UserRepositoryType = {
  register: (data: NewUser) => Promise<User>;
};
