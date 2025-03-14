import { and, eq, or } from 'drizzle-orm';

import { DB } from '../databases';
import { NewUser, User, users } from '../databases/schemas';
import { UserRepositoryType } from '../types/repositories.type';

export class UserRepository implements UserRepositoryType {
  async register(data: NewUser): Promise<User> {
    const [result] = await DB.insert(users).values(data).returning();
    return result;
  }

  async selectUserByEmailorUsername(data: { email?: string; username?: string }): Promise<boolean> {
    console.log('email', data.email);
    console.log('username', data.username);
    const conditions = [or(eq(users.email, data.email ?? ''), eq(users.username, data.username ?? ''))];

    const result = await DB.select()
      .from(users)
      .where(and(...conditions))
      .limit(1);

    return result.length > 0;
  }
}
