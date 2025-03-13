import { BaseError } from './base.error';

// 400 Validation Error (Now Includes Detailed Errors)
type HttpErrorStatusProps =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR';

type HttpErrorProps = {
  [key in HttpErrorStatusProps]: { code: number; msg: string };
};

export const HTTP_ERROR: HttpErrorProps = {
  BAD_REQUEST: { code: 400, msg: 'Bad Request!' },
  UNAUTHORIZED: { code: 401, msg: 'Unauthorized!' },
  FORBIDDEN: { code: 403, msg: 'Forbidden!' },
  NOT_FOUND: { code: 404, msg: 'Not Found!' },
  CONFLICT: { code: 409, msg: 'Conflict!' },
  INTERNAL_SERVER_ERROR: { code: 500, msg: 'Internal Server Error!' },
};

export class ErrorValidation extends BaseError {
  constructor(description = HTTP_ERROR.BAD_REQUEST.msg, errors?: any) {
    super(HTTP_ERROR.BAD_REQUEST.msg, HTTP_ERROR.BAD_REQUEST.code, description, errors);
  }
}

// 401 Unauthorized Error
export class ErrorUnauthorized extends BaseError {
  constructor(description = HTTP_ERROR.UNAUTHORIZED.msg) {
    super(HTTP_ERROR.UNAUTHORIZED.msg, HTTP_ERROR.UNAUTHORIZED.code, description);
  }
}

// 404 Not Found Error
export class ErrorNotFound extends BaseError {
  constructor(description = HTTP_ERROR.NOT_FOUND.msg) {
    super(HTTP_ERROR.NOT_FOUND.msg, HTTP_ERROR.NOT_FOUND.code, description);
  }
}

// 409 Conflict Error
export class ErrorConflict extends BaseError {
  constructor(description = HTTP_ERROR.CONFLICT.msg) {
    super(HTTP_ERROR.CONFLICT.msg, HTTP_ERROR.CONFLICT.code, description);
  }
}

// 500 Internal Server Error
export class ErrorAPI extends BaseError {
  constructor(description = HTTP_ERROR.INTERNAL_SERVER_ERROR.msg) {
    super(HTTP_ERROR.INTERNAL_SERVER_ERROR.msg, HTTP_ERROR.INTERNAL_SERVER_ERROR.code, description);
  }
}
