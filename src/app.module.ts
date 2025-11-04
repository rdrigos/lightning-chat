import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { LoggerModule } from '@/infrastructure/logger/logger.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Infrastructure
    CryptographyModule,
    EnvironmentModule,
    LoggerModule,

    // Modules
    UsersModule,
  ],
})
export class AppModule {}
