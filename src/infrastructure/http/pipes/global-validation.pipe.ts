import { PropertyErrorDTO } from '@/infrastructure/http/dtos/property-error.dto';
import { ApiValidationException } from '@/infrastructure/http/exceptions/validation.exception';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class GlobalValidationPipe implements PipeTransform {
  public async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value === undefined || value === null) {
      throw new BadRequestException('Request body is missing or invalid');
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
      throw new BadRequestException('Request body is empty');
    }

    if (!metatype || this.isPrimitive(value)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length >= 1) {
      throw new ApiValidationException(this.flattenErrors(errors));
    }

    return object;
  }

  private isPrimitive(value: any): boolean {
    return ['boolean', 'number', 'string'].includes(typeof value);
  }

  private flattenErrors(errors: ValidationError[]): any[] {
    const errs: PropertyErrorDTO[] = [];

    for (const error of errors) {
      if (error.constraints) {
        errs.push({
          property: error.property ?? 'Unknown property',
          message: Object.values(error.constraints).shift() ?? 'Invalid value',
        });
      }
    }

    return errs;
  }
}
