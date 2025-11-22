import { ApiProperty } from '@nestjs/swagger';

export class FieldErrorDTO {
  @ApiProperty({
    description: 'The name of the field that failed validation',
    example: 'email',
  })
  field!: string;

  @ApiProperty({
    description: 'A detailed message explaining why the field validation failed',
    example: 'The provided email is invalid',
  })
  message!: string;
}
