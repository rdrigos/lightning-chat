import { AppModule } from '@/app.module';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { GlobalExceptionFilter } from '@/infrastructure/http/filters/global-exception.filter';
import { GlobalValidationPipe } from '@/infrastructure/http/pipes/global-validation.pipe';
import fastifyCookie from '@fastify/cookie';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // Initialize required dependencies and services
  const env = app.get(EnvironmentService);

  // Configure Fastify plugins
  app.register(fastifyCookie);

  // Configure global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configure global pipes
  app.useGlobalPipes(new GlobalValidationPipe());

  await app.listen(env.get('PORT'));
})();
