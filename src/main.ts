import { AppModule } from '@/app.module';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { NestFactory } from '@nestjs/core';
import { LoggerService } from './infrastructure/logger/logger.service';

(async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Initialize required dependencies and services
  const env = app.get(EnvironmentService);
  const logger = app.get(LoggerService);

  // Configure global application utilities
  app.useLogger(logger);

  await app.listen(env.get('PORT'));
})();
