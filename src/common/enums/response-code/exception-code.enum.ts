// TECHDEBT: Need to decide what codes to use for each exception. Create custom codes to represent each error.
export enum ExceptionCode {
  UNAUTHORIZED = 'UNAUTHORIZED_USER',
  FORBIDDEN = 'FORBIDDEN_ACCESS',
  NOT_FOUND = 'DATA_NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}
