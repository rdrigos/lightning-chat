import { AppModule } from '@/app.module';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

(async () => {
  const logger = new Logger('NestApplication');

  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Resolve required services from the DI container
  const env = app.get(EnvironmentService);

  // Retrieve host and port configuration from environment
  const host = env.get('HOST');
  const port = env.get('PORT');

  // Start the HTTP server
  await app.listen(port, host);

  // Retrieves the application URL
  const url = await app.getUrl();

  logger.log(`Server is running at: ${url}`);
})();
