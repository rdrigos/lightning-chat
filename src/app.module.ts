import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { LoggerModule } from '@/infrastructure/logger/logger.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule, LoggerModule],
})
export class AppModule {}
