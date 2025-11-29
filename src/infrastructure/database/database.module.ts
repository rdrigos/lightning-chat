import { DrizzleProvider } from '@/infrastructure/database/drizzle/drizzle.provider';
import { DrizzleSessionRepository } from '@/infrastructure/database/drizzle/repositories/session.repository';
import { DrizzleUserRepository } from '@/infrastructure/database/drizzle/repositories/user.repository';
import { EnvironmentModule } from '@/infrastructure/environment/environment.module';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentModule],
  providers: [
    DrizzleProvider,
    {
      provide: SessionRepository,
      useClass: DrizzleSessionRepository,
    },
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [DrizzleProvider, SessionRepository, UserRepository],
})
export class DatabaseModule {}
