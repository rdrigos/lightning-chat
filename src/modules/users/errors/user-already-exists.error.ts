export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email '${email}' already exists`);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
