import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorDTO {
  @ApiProperty({
    description: 'HTTP code',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  code!: number;

  @ApiProperty({
    description: 'Error description',
    example: 'Unexpected server error while processing the request',
  })
  message!: string;

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
