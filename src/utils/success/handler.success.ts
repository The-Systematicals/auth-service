import { Request, Response } from 'express';

import { getRouteName } from '../data';

type HttpSuccessStatusProps = 'OK' | 'CREATED';

type HttpSuccessProps = {
  [key in HttpSuccessStatusProps]: { code: number; msg: string };
};

export const HTTP_SUCCESS: HttpSuccessProps = {
  OK: { code: 200, msg: 'Ok' },
  CREATED: { code: 201, msg: 'Created' },
};

export const SUCCESS = (req: Request, routeName: string = '') => {
  const name = getRouteName(req, routeName);
  return {
    Created: `${name} Successfully Created!`,
    Found: `${name} Successfully Retrieved!`,
    FoundAll: `${name} Successfully Retrieved All!`,
    Edited: `${name} Successfully Updated!`,
    Removed: `${name} Successfully Deleted!`,
  };
};

export const handleSuccess = <T>(
  res: Response,
  http: { code: number; msg: string },
  message: string,
  data: T,
  count: number | null = null,
): Response => {
  return res.status(http.code).json({
    status: http.code,
    statusMsg: http.msg,
    message: message,
    ...(count !== null ? { count } : {}),
    ...(data !== null ? { data } : {}),
  });
};
