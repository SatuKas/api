import { SuccessCode } from '../enums/response-code/success-code.enum';
import { SuccessMessage } from '../enums/message/success-message.enum';
import { ApiResponse, ResponseStatus } from 'src/types/api-response.type';

export class SuccessResponseMapper {
  static mapSuccess<T>(
    data: T,
    message: SuccessMessage,
    code?: SuccessCode,
  ): ApiResponse<T> {
    return {
      status: ResponseStatus.SUCCESS,
      code: code ?? SuccessCode.OK,
      message: message || this.getDefaultMessage(code ?? SuccessCode.OK),
      data,
    };
  }

  private static getDefaultMessage(code: SuccessCode): string {
    const messageMapping = {
      [SuccessCode.OK]: SuccessMessage.OK,
      [SuccessCode.CREATED]: SuccessMessage.CREATED,
      [SuccessCode.UPDATED]: SuccessMessage.UPDATED,
      [SuccessCode.DELETED]: SuccessMessage.DELETED,
      [SuccessCode.FETCHED]: SuccessMessage.FETCHED,
    };

    return messageMapping[code] || 'Operation completed successfully';
  }
}
