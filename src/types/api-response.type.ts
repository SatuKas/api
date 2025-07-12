import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';

export interface ResponseData<T> {
  data: T;
  message: ExceptionMessage | SuccessMessage | null;
}

export interface ApiResponse<T> extends ResponseData<T> {
  status: 'success' | 'error';
  error?: {
    code: ExceptionCode;
    details?: Array<Record<string, any>>;
  };
  timestamp?: string;
  path?: string;
}
