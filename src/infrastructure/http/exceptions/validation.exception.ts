import { PropertyErrorDTO } from '@/infrastructure/http/dtos/property-error.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiValidationException extends HttpException {
  constructor(errors: PropertyErrorDTO[]) {
    super({ errors }, HttpStatus.BAD_REQUEST);
  }
}
