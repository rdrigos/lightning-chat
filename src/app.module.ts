import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule],
})
export class AppModule {}
