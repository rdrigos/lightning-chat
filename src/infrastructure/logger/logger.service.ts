import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @InjectPinoLogger()
    private readonly logger: PinoLogger
  ) {}

  public verbose(message: string, context?: string): void {
    this.logger.trace({ context }, message);
  }

  public debug(message: string, context?: string): void {
    this.logger.debug({ context }, message);
  }

  public log(message: string, context?: string): void {
    this.logger.info({ context }, message);
  }

  public warn(message: string, context?: string): void {
    this.logger.warn({ context }, message);
  }

  public error(message: string, trace?: string, context?: string): void {
    this.logger.error({ context, trace }, message);
  }

  public fatal(message: string, trace?: string, context?: string): void {
    this.logger.fatal({ context, trace }, message);
  }
}
