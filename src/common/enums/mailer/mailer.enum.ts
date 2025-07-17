import { Routes } from '../routes/routes.enum';

/**
 * Enum for mailer email titles.
 * Used as the main title/header in email templates.
 */
export enum MailerTitle {
  VERIFY_EMAIL = 'Verify Your Email', // Title for email verification
  WELCOME = 'Welcome to Our App!', // Title for welcome email
  RESET_PASSWORD = 'Reset Your Password', // Title for password reset email
}

/**
 * Enum for mailer email subjects.
 * Used as the subject line in outgoing emails.
 */
export enum MailerSubject {
  VERIFY_EMAIL = 'Verify Your Email', // Subject for email verification
  WELCOME = 'Welcome to Our App!', // Subject for welcome email
  RESET_PASSWORD = 'Reset Your Password', // Subject for password reset email
}

/**
 * Enum for verify email URL paths.
 * Used to generate links for email verification.
 */
export enum VerifyEmailPath {
  FRONTEND = '/auth/verify-email?token=:token', // Frontend route, :token will be replaced with actual token
  BACKEND = `/api/v1/${Routes.AUTH}/${Routes.AUTH_EMAIL_VERIFY}`, // Backend API endpoint for email verification
}

/**
 * Enum for reset password URL paths.
 * Used to generate links for password reset.
 */
export enum ResetPasswordPath {
  FRONTEND = '/auth/reset-password?token=:token', // Frontend route, :token will be replaced with actual token
  BACKEND = `/api/v1/${Routes.AUTH}/${Routes.AUTH_RESET_PASSWORD}`, // Backend API endpoint for password reset
}
