import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionMessage } from '../enums/message/exception-message.enum';
import { AppLogger } from '../logger/logger.service';
import { loggerMessageFormater } from 'src/shared/utils/logger.utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.setContext('AllExceptionsFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ExceptionMessage.SERVER_ERROR;
    let errorData = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();

      if (typeof responseObj === 'string') {
        message = responseObj as ExceptionMessage;
      } else if (typeof responseObj === 'object' && responseObj !== null) {
        message =
          (responseObj as any).message || (responseObj as any).error || message;
        errorData = responseObj as any;
      }
    } else if (exception instanceof Error) {
      message = exception.message as ExceptionMessage;
    }

    this.logger.error(
      loggerMessageFormater({
        endpoint: request.url,
        method: request.method,
        request: request.body,
        response: errorData,
        statusCode: status,
      }),
    );

    response.status(status).json({
      status: 'error',
      message,
      data: errorData,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
