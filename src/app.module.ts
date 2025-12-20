import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Infrastructure
    EnvironmentModule,

    // Modules
    UsersModule,
  ],
})
export class AppModule {}
