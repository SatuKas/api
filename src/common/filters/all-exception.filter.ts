import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionMessage } from '../enums/message/exception-message.enum';
import { AppLogger } from '../logger/logger.service';
import { loggerMessageFormater } from 'src/shared/utils/logger.utils';
import { ExceptionResponseMapper } from 'src/common/mappers/exception-response.mapper';

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
    let details: Array<Record<string, any>> | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();

      if (typeof responseObj === 'string') {
        message = responseObj as ExceptionMessage;
      } else if (typeof responseObj === 'object' && responseObj !== null) {
        if (
          exception instanceof BadRequestException &&
          Array.isArray((responseObj as any).message)
        ) {
          const validationErrors = (responseObj as any).message;
          details = validationErrors;
          message = ExceptionMessage.BAD_REQUEST;
        } else {
          message =
            (responseObj as any).message ||
            (responseObj as any).error ||
            message;
        }
        errorData = responseObj as any;
      }
    } else if (exception instanceof Error) {
      message = exception.message as ExceptionMessage;
      errorData = exception.stack as any;
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

    // TECHDEBT: This mapper still can't remapping default http exception message.
    // Send user-friendly response
    const errorResponse = ExceptionResponseMapper.mapException(
      status,
      request.url,
      details,
      message,
      undefined,
    );

    response.status(status).json(errorResponse);
  }
}
