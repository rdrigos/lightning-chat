import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { LoggerModule } from '@/infrastructure/logger/logger.module';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule, LoggerModule, UsersModule],
})
export class AppModule {}
