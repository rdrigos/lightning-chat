import { ApiValidationException } from '@/core/exceptions/api-validation.exception';
import { FieldErrorDTO } from '@/shared/dtos/field-error.dto';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as util from 'node:util';

@Injectable()
export class RequestValidationPipe implements PipeTransform {
  public async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<any> {
    if (value === undefined || value === null) {
      throw new BadRequestException('Request body is missing or invalid');
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
      throw new BadRequestException('Request body is empty');
    }

    if (!metatype) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const fieldErrors = this.flattenErrors(errors);
      throw new ApiValidationException(fieldErrors);
    }

    return object;
  }

  private flattenErrors(errors: ValidationError[]): FieldErrorDTO[] {
    const result: FieldErrorDTO[] = [];

    for (const error of errors) {
      if (error.constraints) {
        result.push({
          field: error.property,
          message: Object.values(error.constraints).shift() ?? 'Invalid value',
        });
      }

      if (error.children?.length) {
        const children = this.flattenErrors(error.children).map((child) => ({
          field: util.format('%s.%s', error.property, child.field),
          message: child.message,
        }));

        result.push(...children);
      }
    }

    return result;
  }
}
