import { GlobalExceptionFilter } from '@/infrastructure/http/filters/global-exception.filter';
import { GlobalValidationPipe } from '@/infrastructure/http/pipes/global-validation.pipe';
import fastifyCookie from '@fastify/cookie';
import { ModuleMetadata } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';

export async function createTestApp(metadata: ModuleMetadata): Promise<NestFastifyApplication> {
  const module = await Test.createTestingModule(metadata).compile();

  // Creates the Nest application using the Fastify adapter
  const app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  // Pipes and Filters
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Plugins
  app.register(fastifyCookie);

  // Initializes the Nest application and waits for Fastify to be fully ready to handle requests
  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  // Returns the fully initialized NestFastifyApplication
  return app;
}
