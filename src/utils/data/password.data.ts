import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';

import { CONFIG } from '../../configs';

export const setPasswordToHash = async <T>(password: T): Promise<string> => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password + CONFIG.HASH_SECRET, saltRounds);
  return hashed;
};

export const isPasswordCorrect = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password + CONFIG.HASH_SECRET, hash);
};

export const asdaasd = (req: Request) => {
  console.log('ee', req.headers['user-agent']);
};
