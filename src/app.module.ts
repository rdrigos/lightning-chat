import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { LoggerModule } from '@/infrastructure/logger/logger.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Infrastructure
    CryptographyModule,
    DatabaseModule,
    EnvironmentModule,
    LoggerModule,

    // Modules
    UsersModule,
  ],
})
export class AppModule {}
