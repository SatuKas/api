import { HttpException } from '@nestjs/common';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';

const throwException = (
  Exception: new (...args: any[]) => HttpException,
  message: ExceptionMessage,
  code: ExceptionCode,
) => new Exception({ message, code });

export default throwException;
