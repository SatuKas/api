import { Routes } from '../routes/routes.enum';

export enum MailerTitle {
  VERIFY_EMAIL = 'Verify Your Email',
  WELCOME = 'Welcome to Our App!',
}

export enum MailerSubject {
  VERIFY_EMAIL = 'Verify Your Email',
  WELCOME = 'Welcome to Our App!',
}

export enum VerifyEmailPath {
  FRONTEND = 'verify-email?token=:token',
  BACKEND = `/api/v1/${Routes.AUTH}/${Routes.AUTH_EMAIL_VERIFY}`,
}
