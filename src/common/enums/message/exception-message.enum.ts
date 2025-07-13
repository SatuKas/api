export enum ExceptionMessage {
  UNAUTHORIZED = 'Access denied. Please login to continue.',
  FORBIDDEN = 'You do not have permission to access this resource.',
  NOT_FOUND = 'The requested resource was not found.',
  VALIDATION_FAILED = 'Validation failed',
  SERVER_ERROR = 'Something went wrong. Please try again later.',
  BAD_REQUEST = 'Invalid request. Please check your input.',
  INVALID_CREDENTIALS = 'Username or password is incorrect.',
  EMAIL_ALREADY_REGISTERED = 'Email already registered',
  USERNAME_ALREADY_TAKEN = 'Username already taken',
  INVALID_REFRESH_TOKEN_DEVICE = 'Invalid refresh token device',
  INVALID_REFRESH_TOKEN = 'Invalid refresh token',
}
