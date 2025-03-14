import jwt from 'jsonwebtoken';

import { User } from '../databases/schemas';
import { BaseRepository, UserRepository } from '../repositories';
import { AuthentiationServiceType } from '../types/services.type';
import {
  ErrorNotFound,
  ErrorValidation,
  bool,
  generateTokens,
  getDateTime,
  getDateTimeAddMinutes,
  getDateTimeRemaining,
  isPasswordCorrect,
} from '../utils';

export class AuthenticationService implements AuthentiationServiceType {
  constructor(private baseRepository: BaseRepository<Partial<User>>) {}
  async login(data: { email?: string; username?: string; password?: string }): Promise<{ token: string }> {
    const { email, username, password } = data;

    if (!email && !username) {
      throw new ErrorValidation('Username / Email must be provided!');
    }

    const name = email ? { email: email as string } : { username: username as string };

    const userExist = await this.baseRepository.select(name);

    if (!userExist) {
      throw new ErrorNotFound('User not found!');
    }

    // check if account is locked
    if (userExist.dateLockoutExpiration && getDateTime() < userExist.dateLockoutExpiration) {
      const { isMinute, value } = getDateTimeRemaining(userExist.dateLockoutExpiration);
      throw new ErrorValidation(
        `Account is locked due to too many failed login attempts! Please try again after ${value} ${isMinute ? 'minutes' : 'seconds'}`,
      );
    }

    const isPasswordValid = await isPasswordCorrect(password as string, userExist.password as string);

    if (!isPasswordValid) {
      // update failed login attempt
      const lockoutThreshold = 5;
      const lockoutMinutes = 15;

      const loginAttempt = Number(userExist.failedLoginAttempts) + 1;
      const qualifiedToLocked = loginAttempt >= lockoutThreshold;

      await this.baseRepository.update(name, {
        dateLastFailedLogin: getDateTime(),
        failedLoginAttempts: loginAttempt,
        isAccountLocked: qualifiedToLocked ? bool.YES : bool.NO,
        dateLockoutExpiration:
          !userExist.dateLockoutExpiration && qualifiedToLocked
            ? getDateTimeAddMinutes(lockoutMinutes)
            : userExist.dateLockoutExpiration,
      });

      // set both username and password on msg even its only incorrect password
      throw new ErrorNotFound('Incorrect Username / Password!');
    }

    const payload = { id: userExist.id, ...name };

    const { accessToken, refreshToken } = generateTokens(payload);

    // update login info
    await this.baseRepository.update(name, {
      refreshToken: refreshToken,
      dateLastLogin: getDateTime(),
      failedLoginAttempts: 0,
      isAccountLocked: bool.NO,
      dateLockoutExpiration: null,
    });

    return { token: accessToken };
  }
}
