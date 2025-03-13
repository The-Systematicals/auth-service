import { DB } from '../databases';
import { NewUser, User, users } from '../databases/schemas';
import { UserRepositoryType } from '../types/repositories.type';

export class UserRepository implements UserRepositoryType {
  async register(data: NewUser): Promise<User> {
    const [result] = await DB.insert(users).values(data).returning();
    return result;
  }
}
