import { Trim } from '@/core/decorators/trim.decorator';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInRequest {
  @IsEmail({}, { message: 'The email address is not valid' })
  @Trim()
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  public email!: string;

  @MaxLength(128, { message: 'Password must have at most 128 characters' })
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @Trim()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  public password!: string;
}
