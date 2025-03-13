import { NewUser, User } from '../databases/schemas';
import { setBoolean } from '../utils/data/data';

export class UserTransformer {
  static transform(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      active: setBoolean(user.isActive),
    };
  }
  static transformMany(users: User[]) {
    return users.map(this.transform);
  }
}
