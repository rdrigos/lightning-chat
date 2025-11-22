import { FieldErrorDTO } from '@/shared/dtos/field-error.dto';
import { BadRequestException } from '@nestjs/common';

export class ApiValidationException extends BadRequestException {
  constructor(errors: FieldErrorDTO[]) {
    super({ errors });
  }
}
