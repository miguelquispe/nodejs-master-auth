export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    // statusCode: HTTP status code associated with the error: 404, 500, etc.
    this.statusCode = statusCode;
    // details: Additional information about the error
    this.details = details;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
