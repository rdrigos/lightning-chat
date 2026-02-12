import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    // Infrastructure
    CryptographyModule,
    DatabaseModule,
    EnvironmentModule,

    // Modules
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
