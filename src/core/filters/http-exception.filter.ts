import { ApiValidationException } from '@/core/exceptions/api-validation.exception';
import { FieldErrorDTO } from '@/shared/dtos/field-error.dto';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface ValidationPayload {
  errors: FieldErrorDTO[];
}

interface HttpPayload {
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): Response {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const payload = exception.getResponse();
    const timestamp = new Date();

    if (exception instanceof ApiValidationException) {
      const { errors } = payload as ValidationPayload;

      return response.status(status).json({
        code: status,
        errors,
        path: request.url,
        timestamp,
      });
    }

    if (exception instanceof HttpException) {
      const { message } = payload as HttpPayload;

      return response.status(status).json({
        code: status,
        message,
        path: request.url,
        timestamp,
      });
    }

    // TODO - Implement error capturing with distributed tracing for monitoring

    // Fallback handler for any unhandled or unexpected internal server error
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Oops! Something went wrong on the server. Please contact support for assistance',
      path: request.url,
      timestamp,
    });
  }
}
