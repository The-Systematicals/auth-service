import { and, desc, eq, or } from 'drizzle-orm';

import { DB } from '../databases';
import { BaseRepositoryType } from '../types/repositories.type';
import { bool, getDateTime, getUserId } from '../utils';

export class BaseRepository<T> implements BaseRepositoryType<T> {
  private table: any;

  constructor(table: any) {
    this.table = table;
  }
  async insert(data: Partial<T>): Promise<T> {
    const results = (await DB.insert(this.table).values(data).returning()) as T[];
    return results[0]; // Ensures correct type handling
  }

  async select(data: Record<string, any>): Promise<T> {
    let conditions = Object.entries(data).map(([key, value]) => eq(this.table[key], value));

    const result = await DB.select()
      .from(this.table)
      .where(and(...conditions))
      .limit(1);

    return result[0] as T;
  }

  async selectAll(): Promise<T[]> {
    return await DB.select()
      .from(this.table)
      .where(eq(this.table.isDeleted, bool.NO))
      .orderBy(desc(this.table.updatedAt));
  }

  async update(condition: Record<string, T>, data: Partial<T>): Promise<T> {
    let conditions = Object.entries(condition).map(([key, value]) => eq(this.table[key], value));

    const updatedData = {
      ...data,
      updatedAt: getDateTime(), // Ensure updatedAt is always set
    };

    const [result] = await DB.update(this.table)
      .set(updatedData)
      .where(and(...conditions))
      .returning();

    return result as T;
  }

  async delete(id: string | number): Promise<boolean> {
    const [deleted] = await DB.update(this.table)
      .set({ deletedUserId: getUserId(), isDeleted: bool.YES })
      .where(eq(this.table.id, id))
      .returning();
    return deleted.length;
  }

  async findDataExistOr(data: Record<string, any>): Promise<boolean> {
    let conditions = Object.entries(data).map(([key, value]) => eq(this.table[key], value));

    const result = await DB.select()
      .from(this.table)
      .where(or(...conditions))
      .limit(1);

    return result.length > 0;
  }

  async selectOption(fieldSelected: keyof T, condition: Record<string, any>): Promise<T[]> {
    let conditions = Object.entries(condition).map(([key, value]) => eq(this.table[key], value));
    const res = await DB.select({ id: this.table.id, name: this.table[fieldSelected] })
      .from(this.table)
      .where(and(...conditions, eq(this.table.isDeleted, bool.NO)))
      .orderBy(desc(this.table.updatedAt));

    return res as T[];
  }
}
