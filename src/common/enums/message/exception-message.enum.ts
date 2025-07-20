export enum ExceptionMessage {
  // System unhandled error
  INTERNAL_SERVER_ERROR = 'Something went wrong. Please try again later.',

  // Database error
  DATABASE_CONNECTION_ERROR = 'We are experiencing a problem connecting to the database. Please try again later.',

  // Authentication/Authorization Error
  UNAUTHORIZED_USER = 'You are not logged in. Please log in to continue.',
  FORBIDDEN_ACCESS = 'You do not have permission to access this resource.',
  INVALID_CREDENTIALS = 'The email or password is incorrect. Please check again.',
  INVALID_TOKEN = 'Your session token is invalid.',
  EXPIRED_TOKEN = 'Your session has expired.',
  REVOKED_TOKEN = 'This token is no longer valid.',
  TOKEN_NOT_FOUND = 'No token was found.',
  EMAIL_NOT_VERIFIED = 'Please verify your email to continue.',

  // Request Error
  INVALID_REQUEST = 'Please review your input and try again.',
  MISSING_REQUIRED_FIELDS = 'Please complete all fields.',
  INVALID_PARAMETERS = 'One or more parameters are invalid.',
  INVALID_QUERY_PARAMETERS = 'The query parameters provided are not valid.',
  INVALID_PATH_PARAMETERS = 'The path parameters provided are not valid.',
  INVALID_HEADER_PARAMETERS = 'There is an issue with the request headers.',
  TOO_MANY_REQUESTS = 'You have made too many requests.',
  UNPROCESSABLE_ENTITY = 'The request was well-formed but was unable to be followed due to semantic errors.',

  // Data Error
  DATA_NOT_FOUND = 'The requested resource was not found.',
  DATA_ALREADY_EXISTS = 'This data already exists in our system.',

  // External Error
  EXTERNAL_CONNECTION_ERROR = 'We are unable to connect to an external service at the moment.',
  EXTERNAL_SERVICE_UNAVAILABLE = 'The external service is currently unavailable. Please try again later.',
  EXTERNAL_SERVICE_TIMEOUT = 'The request to the external service timed out. Please try again.',
  EXTERNAL_SERVICE_ERROR = 'An error occurred with the external service.',
  EXTERNAL_SERVICE_UNAUTHORIZED = 'Access to the external service was denied.',
  EXTERNAL_SERVICE_FORBIDDEN = 'You do not have permission to access this external service.',
  EXTERNAL_SERVICE_NOT_FOUND = 'The requested external service could not be found.',
  EXTERNAL_SERVICE_INVALID_REQUEST = 'The request to the external service was invalid.',

  // Other Error
  FORBIDDEN = 'You do not have permission to access this resource.',
  EMAIL_ALREADY_REGISTERED = 'Email already registered',
  USERNAME_ALREADY_TAKEN = 'Username already taken',
  INVALID_REFRESH_TOKEN_DEVICE = 'Invalid refresh token device',
  EMAIL_ALREADY_VERIFIED = 'Email already verified',
  INVALID_TOKEN_TYPE = 'Invalid token type',
}
