import { DrizzleProvider } from '@/infrastructure/database/drizzle/drizzle.provider';
import { DrizzleUserRepository } from '@/infrastructure/database/drizzle/repositories/user.repository';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule],
  providers: [
    DrizzleProvider,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [DrizzleProvider, UserRepository],
})
export class DatabaseModule {}
