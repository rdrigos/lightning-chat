import { PASSWORD_REGEX } from '@/core/regex';
import { Trim } from '@/shared/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @MaxLength(128, { message: 'Name must have at most 128 characters' })
  @MinLength(8, { message: 'Name must have at least 8 characters' })
  @Trim()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({ example: 'John Doe', minLength: 8, maxLength: 128 })
  public name!: string;

  @IsEmail({}, { message: 'The email address is not valid' })
  @Trim()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ example: 'johndoe@gmail.com' })
  public email!: string;

  @Matches(PASSWORD_REGEX, { message: 'Password must contain uppercase, lowercase, number and special character' })
  @MaxLength(128, { message: 'Password must have at most 128 characters' })
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @Trim()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ example: 'Password@123', minLength: 8, maxLength: 128 })
  public password!: string;
}
