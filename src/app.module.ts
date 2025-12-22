import { CryptographyModule } from '@/infrastructure/cryptography/cryptography.module';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Infrastructure
    CryptographyModule,
    EnvironmentModule,

    // Modules
    UsersModule,
  ],
})
export class AppModule {}
