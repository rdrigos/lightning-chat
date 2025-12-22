import { ConflictException } from '@nestjs/common';
import util from 'node:util';

export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(util.format("User with email '%s' already exists", email));
  }
}
