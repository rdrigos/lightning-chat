import { AppModule } from '@/app.module';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

(async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Initialize required dependencies and services
  const env = app.get(EnvironmentService);
  const logger = app.get(LoggerService);

  // Configure global application utilities
  app.useLogger(logger);

  // Configure global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    })
  );

  await app.listen(env.get('PORT'));
})();
