import { setDateStandard } from '../utils';

export class BaseTransformer<T extends Record<string, any>> {
  transform(schema: T): Partial<Omit<T, 'isDeleted' | 'deletedUserId'>> {
    const { isDeleted, deletedUserId, ...rest } = schema; // Exclude multiple fields
    return {
      ...rest,
      createdAt: setDateStandard(schema.createdAt),
      updatedAt: setDateStandard(schema.updatedAt),
    };
  }

  transformMany(schemas: T[]): Partial<Omit<T, 'isDeleted' | 'deletedUserId'>>[] {
    return schemas.map(({ isDeleted, deletedUserId, ...schema }) => ({
      ...schema,
      createdAt: setDateStandard(schema.createdAt),
      updatedAt: setDateStandard(schema.updatedAt),
    }));
  }
}
