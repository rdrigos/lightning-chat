import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/core/filters/http-exception.filter';
import { RequestValidationPipe } from '@/core/pipes/request-validation.pipe';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

(async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Initialize required dependencies and services
  const env = app.get(EnvironmentService);
  const logger = app.get(LoggerService);

  // Configure global application utilities
  app.useLogger(logger);

  // Configure global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configure global pipes
  app.useGlobalPipes(new RequestValidationPipe());

  // Generates the OpenAPI specification with Swagger
  const config = new DocumentBuilder()
    .setTitle(env.get('NAME'))
    .setDescription(env.get('DESCRIPTION'))
    .setVersion(env.get('VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Registers all of the application's routes
  app.use('/docs', apiReference({ content: document }));

  await app.listen(env.get('PORT'));
})();
