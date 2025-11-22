import { FieldErrorDTO } from '@/shared/dtos/field-error.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiValidationErrorDTO {
  @ApiProperty({
    description: 'HTTP code',
    example: HttpStatus.BAD_REQUEST,
  })
  code!: number;

  @ApiProperty({
    description: 'List of field validation errors',
    type: [FieldErrorDTO],
  })
  errors!: FieldErrorDTO[];

  @ApiProperty({
    description: 'Endpoint where the error occurred',
    example: '/example',
  })
  path!: string;

  @ApiProperty({
    description: 'Moment when the error occurred',
  })
  timestamp!: Date;
}
