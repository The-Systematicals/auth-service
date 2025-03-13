import { setDateStandard } from '../utils';

export class OptionTransformer<T extends Record<string, any>> {
  transform(schema: T): Partial<T> {
    const transformed = {
      id: schema.id,
      name: schema.name,
    };

    return transformed as unknown as Partial<T>; // Double casting fix
  }

  transformMany(schemas: T[]): Partial<T>[] {
    return schemas.map((schema) => this.transform(schema));
  }
}
