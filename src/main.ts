import { AppModule } from '@/app.module';
import { EnvironmentService } from '@/infrastructure/environment/environment.service';
import { NestFactory } from '@nestjs/core';

(async () => {
  const app = await NestFactory.create(AppModule);

  const env = app.get(EnvironmentService);

  await app.listen(env.get('PORT'));
})();
