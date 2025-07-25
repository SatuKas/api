import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from '../enums/response-code/exception-code.enum';
import { ExceptionMessage } from '../enums/message/exception-message.enum';
import { ApiResponse, ResponseStatus } from 'src/types/api-response.type';

export class ExceptionResponseMapper {
  private static readonly errorMapping = {
    [HttpStatus.UNAUTHORIZED]: {
      code: ExceptionCode.UNAUTHORIZED_USER,
      message: ExceptionMessage.UNAUTHORIZED_USER,
    },
    [HttpStatus.FORBIDDEN]: {
      code: ExceptionCode.FORBIDDEN_ACCESS,
      message: ExceptionMessage.FORBIDDEN_ACCESS,
    },
    [HttpStatus.NOT_FOUND]: {
      code: ExceptionCode.DATA_NOT_FOUND,
      message: ExceptionMessage.DATA_NOT_FOUND,
    },
    [HttpStatus.BAD_REQUEST]: {
      code: ExceptionCode.INVALID_REQUEST,
      message: ExceptionMessage.INVALID_REQUEST,
    },
    [HttpStatus.UNPROCESSABLE_ENTITY]: {
      code: ExceptionCode.UNPROCESSABLE_ENTITY,
      message: ExceptionMessage.UNPROCESSABLE_ENTITY,
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: {
      code: ExceptionCode.INTERNAL_SERVER_ERROR,
      message: ExceptionMessage.INTERNAL_SERVER_ERROR,
    },
  };

  private static isUserFriendlyMessage(message: string): boolean {
    // Check if message is user-friendly (not technical/stack trace)
    const technicalKeywords = [
      'error',
      'exception',
      'stack',
      'trace',
      'undefined',
      'null',
      'object',
      'function',
      'module',
      'require',
      'import',
      'json',
      'etimedout',
    ];

    const lowerMessage = message.toLowerCase();
    return !technicalKeywords.some((keyword) => lowerMessage.includes(keyword));
  }

  static mapException(
    statusCode: number,
    path: string,
    details?: Array<Record<string, any>>,
    customMessage?: string,
    customCode?: string,
  ): ApiResponse<null> {
    const mapping =
      this.errorMapping[statusCode] ||
      this.errorMapping[HttpStatus.INTERNAL_SERVER_ERROR];

    let message = mapping.message;

    if (customMessage && this.isUserFriendlyMessage(customMessage)) {
      message = customMessage;
    }

    return {
      status: ResponseStatus.ERROR,
      code: customCode || mapping.code,
      message: message,
      data: null,
      error: {
        details: details || [],
      },
      timestamp: new Date().toISOString(),
      path: path || '',
    };
  }
}
