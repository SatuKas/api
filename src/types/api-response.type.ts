import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import { SuccessCode } from 'src/common/enums/response-code/success-code.enum';

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface ResponseData<T> {
  data: T;
  message: ExceptionMessage | SuccessMessage | null;
}

export interface ExtraDataResponse {
  limit?: number;
  page?: number;
  total?: number;
  total_pages?: number;
  next_page?: number;
  prev_page?: number;
}

export interface ApiResponse<T> extends ResponseData<T> {
  status: ResponseStatus;
  code: ExceptionCode | SuccessCode;
  error?: {
    details?: Array<Record<string, any>>;
  };
  timestamp?: string;
  path?: string;
  extra_data?: ExtraDataResponse;
}
