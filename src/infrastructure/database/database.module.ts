import { DrizzleProvider } from '@/infrastructure/database/drizzle/drizzle.provider';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule],
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DatabaseModule {}
