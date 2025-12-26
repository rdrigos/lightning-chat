import { PropertyErrorDTO } from '@/infrastructure/http/dto/property-error.dto';
import { ApiValidationException } from '@/infrastructure/http/exceptions/validation.exception';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface ValidationPayload {
  errors: PropertyErrorDTO[];
}

interface HttpExceptionPayload {
  message: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): Response {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const timestamp = new Date();

    if (exception instanceof ApiValidationException) {
      const status = exception.getStatus();
      const payload = exception.getResponse() as ValidationPayload;

      return response.status(status).json({
        code: status,
        errors: payload.errors,
        path: request.url,
        timestamp,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse() as HttpExceptionPayload;

      return response.status(status).json({
        code: status,
        message: payload.message,
        path: request.url,
        timestamp,
      });
    }

    // TODO - Implement error capturing with distributed tracing for monitoring
    console.error(exception);

    // Fallback handler for any unhandled or unexpected internal server error
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Oops! Something went wrong on the server. Please contact support for assistance',
      path: request.url,
      timestamp,
    });
  }
}
