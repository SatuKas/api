import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from '../enums/response-code/exception-code.enum';
import { ExceptionMessage } from '../enums/message/exception-message.enum';
import { ApiResponse } from 'src/types/api-response.type';

export class ExceptionResponseMapper {
  private static readonly errorMapping = {
    [HttpStatus.UNAUTHORIZED]: {
      code: ExceptionCode.UNAUTHORIZED,
      message: ExceptionMessage.UNAUTHORIZED,
    },
    [HttpStatus.FORBIDDEN]: {
      code: ExceptionCode.FORBIDDEN,
      message: ExceptionMessage.FORBIDDEN,
    },
    [HttpStatus.NOT_FOUND]: {
      code: ExceptionCode.NOT_FOUND,
      message: ExceptionMessage.NOT_FOUND,
    },
    [HttpStatus.BAD_REQUEST]: {
      code: ExceptionCode.BAD_REQUEST,
      message: ExceptionMessage.BAD_REQUEST,
    },
    [HttpStatus.UNPROCESSABLE_ENTITY]: {
      code: ExceptionCode.VALIDATION_FAILED,
      message: ExceptionMessage.VALIDATION_FAILED,
    },
    [HttpStatus.INTERNAL_SERVER_ERROR]: {
      code: ExceptionCode.SERVER_ERROR,
      message: ExceptionMessage.SERVER_ERROR,
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
      status: 'error',
      message: message,
      data: null,
      error: {
        code: customCode || mapping.code,
        details: details,
      },
      timestamp: new Date().toISOString(),
      path: path || '',
    };
  }
}
