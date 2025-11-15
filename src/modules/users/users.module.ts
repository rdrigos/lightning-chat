import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user.use-case';
import { UsersController } from '@/modules/users/users.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [UsersController],
  providers: [CreateUserUseCase],
})
export class UsersModule {}
