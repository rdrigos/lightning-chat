import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case';
import { Module } from '@nestjs/common';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [AuthController],
  providers: [SignInUseCase],
})
export class AuthModule {}
