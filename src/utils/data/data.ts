import bcrypt from 'bcryptjs';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { CONFIG } from '../../configs';

// generate starts here ...
export const generateUUID = (): string => {
  return uuidv4();
};

// set starts here ...

export const setBoolean = (value: any): boolean => {
  return Number(value) !== 0;
};

let defaultUserId: any = null;
export const setUserId = <T>(id: T) => {
  defaultUserId = id;
};

let defaultIp: any = null;
export const setUserIP = <T>(ip: T) => {
  defaultIp = ip;
};

let defaultUserAgent: any = null;
export const setUserAgent = <T>(userAgent: T) => {
  defaultUserAgent = userAgent;
};

// get starts here ...
export const getUserId = () => {
  return defaultUserId;
};

export const getUserIP = () => {
  return defaultIp;
};

export const getUserAgent = () => {
  return defaultUserAgent;
};

export const getRouteName = (req: Request, routeName: string = ''): string => {
  const baseUrl = req.originalUrl;
  let route = baseUrl.split('/')[1];

  if (!route && !routeName) return '';

  // Remove last character if it's "s"
  if (route.endsWith('s')) {
    route = route.slice(0, -1).replace('-', ' ');
  }
  // Uppercase first character
  return routeName ? routeName : route.charAt(0).toUpperCase() + route.slice(1);
};

export const getDefaultSelectCond = <T>(req: Request) => {
  const { fieldSelected, condition } = req.query;
  const selected = ((fieldSelected as string) || 'name') as keyof T;
  const cond = condition ? JSON.parse(condition as string) : {};

  return {
    selected,
    cond,
  };
};
