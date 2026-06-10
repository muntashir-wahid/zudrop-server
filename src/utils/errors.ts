export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  errors: { field: string; message: string }[];

  constructor(errors: { field: string; message: string }[]) {
    super('Validation failed', 400);
    this.errors = errors;
  }
}
