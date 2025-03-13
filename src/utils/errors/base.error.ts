export class BaseError extends Error {
  public status: number;
  public errors?: any;

  constructor(name: string, status: number, message: string, errors?: any) {
    super(message);
    this.name = name;
    this.status = status;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
