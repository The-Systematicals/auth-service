import { AccessType, Company, Gender, NewUser, Project, Role, User } from '../databases/schemas';

export type BaseSchemaType<T> = {
  create: (data: Partial<T>) => Promise<Partial<T>>;
  find: (condition: Record<string, any>) => Promise<Partial<T>>;
  findAll: () => Promise<Partial<T>[]>;
  edit: (condition: Record<string, any>, data: Partial<T>) => Promise<Partial<T>>;
  remove: (id: string | number) => Promise<boolean>;
  option: (fieldSelected: keyof T, condition: Record<string, any>) => Promise<Partial<T>[]>;
};

export type BaseServiceType<T> = Omit<BaseSchemaType<T>, 'create'> & {
  create: (condition: Record<string, any>, data: Partial<T>) => Promise<Partial<T>>;
};

export type AccessTypeServiceType = BaseSchemaType<AccessType>;

export type CompanyServiceType = BaseSchemaType<Company>;

export type GenderServiceType = BaseSchemaType<Gender>;

export type ProjectServiceType = BaseSchemaType<Project>;

export type RoleServiceType = BaseSchemaType<Role>;

export type UserServiceType = BaseSchemaType<User>;

// export type UserServiceType = BaseSchemaType<User> & {
//   register: (data: RegisterRequestType) => Promise<User>;
// };
