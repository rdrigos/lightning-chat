import { LoggerService } from '@/infrastructure/logger/logger.service';
import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [PinoLoggerModule.forRoot()],
  exports: [LoggerService],
  providers: [LoggerService],
})
export class LoggerModule {}
