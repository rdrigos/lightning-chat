import { AppModule } from '@/app.module';
import { ClassProvider, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

export async function createTestApp(overrides: ClassProvider[] = []): Promise<INestApplication> {
  let module = Test.createTestingModule({ imports: [AppModule] });

  for (const override of overrides) {
    module = module.overrideProvider(override.provide).useClass(override.useClass);
  }

  const moduleRef = await module.compile();
  return moduleRef.createNestApplication();
}
