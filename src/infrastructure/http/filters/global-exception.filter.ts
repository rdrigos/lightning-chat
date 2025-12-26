import { PropertyErrorDTO } from '@/infrastructure/http/dto/property-error.dto';
import { ApiValidationException } from '@/infrastructure/http/exceptions/validation.exception';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

interface ValidationPayload {
  errors: PropertyErrorDTO[];
}

interface HttpExceptionPayload {
  message: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): FastifyReply {
    const context = host.switchToHttp();
    const request = context.getRequest<FastifyRequest>();
    const response = context.getResponse<FastifyReply>();
    const timestamp = new Date();

    if (exception instanceof ApiValidationException) {
      const status = exception.getStatus();
      const payload = exception.getResponse() as ValidationPayload;

      return response.code(status).send({
        code: status,
        errors: payload.errors,
        path: request.url,
        timestamp,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse() as HttpExceptionPayload;

      return response.code(status).send({
        code: status,
        message: payload.message,
        path: request.url,
        timestamp,
      });
    }

    // TODO - Implement error capturing with distributed tracing for monitoring
    console.error(exception);

    // Fallback handler for any unhandled or unexpected internal server error
    return response.code(HttpStatus.INTERNAL_SERVER_ERROR).send({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Oops! Something went wrong on the server. Please contact support for assistance',
      path: request.url,
      timestamp,
    });
  }
}
