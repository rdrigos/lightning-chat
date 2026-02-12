import { PASSWORD_REGEX } from '@/domain/regex';
import { Trim } from '@/infrastructure/decorators/trim.decorator';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDTO {
  @MaxLength(128, { message: 'Name must have at most 128 characters' })
  @MinLength(8, { message: 'Name must have at least 8 characters' })
  @Trim()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  public name!: string;

  @IsEmail({}, { message: 'The email address is not valid' })
  @Trim()
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  public email!: string;

  @Matches(PASSWORD_REGEX, { message: 'Password must contain uppercase, lowercase, number and special character' })
  @MaxLength(128, { message: 'Password must have at most 128 characters' })
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @Trim()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  public password!: string;
}
