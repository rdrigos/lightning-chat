import { DatabaseModule } from '@/infrastructure/database/database.module';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Infrastructure
    DatabaseModule,
    EnvironmentModule,
  ],
})
export class AppModule {}
