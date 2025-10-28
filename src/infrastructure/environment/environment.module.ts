import { schema } from '@/infrastructure/environment/environment.schema';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => schema.parse(env),
      isGlobal: true,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
