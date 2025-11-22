import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({
    description: 'Unique identifier (UUID v7)',
    example: '019a8819-0a14-7547-ac2f-5b6e8f884b6e',
  })
  public id!: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  public name!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'johndoe@gmail.com',
  })
  public email!: string;

  @ApiProperty()
  public createdAt!: Date;

  @ApiProperty()
  public updatedAt!: Date;
}
