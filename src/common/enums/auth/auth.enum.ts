/**
 * AuthEnum
 *
 * Enum for JWT token expiration settings.
 * The values represent the duration for each token type.
 * Format: <number><unit>, where unit can be 'm' (minutes), 'd' (days), etc.
 */
export enum AuthEnum {
  JWT_EXPIRES_IN = '15m', // access token expires in 15 minutes
  JWT_REFRESH_EXPIRES_IN = '7d', // refresh token expires in 7 days
  JWT_EMAIL_EXPIRES_IN = '1d', // email verification token expires in 1 day
  JWT_FORGOT_PASSWORD_EXPIRES_IN = '30m', // forgot password token expires in 30 minutes
}

/**
 * AuthJwtType
 *
 * Enum for JWT token types used in authentication flows.
 */
export enum AuthJwtType {
  PASSWORD = 'PASS', // used for password authentication
  EMAIL_VERIFICATION = 'VERIF', // used for email verification process
}
