import { Environment } from '@/infrastructure/environment/environment.schema';
import { Injectable } from '@nestjs/common';
import { ConfigService, PathValue } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService<Environment, true>) {}

  public get<T extends keyof Environment>(key: T): PathValue<Environment, T> {
    return this.configService.get(key, { infer: true });
  }
}
