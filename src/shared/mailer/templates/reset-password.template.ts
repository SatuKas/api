import { MailerTitle } from 'src/common/enums/mailer/mailer.enum';
import { baseLayout } from './base.layout';

export const resetPasswordTemplate = (name: string, link: string) => {
  const content = `
    <p>Hi ${name},</p>
    <p>We received a request to reset your password.</p>
    <p>Click the link below to reset it:<br />
      <a href="${link}">Reset Password</a>
    </p>
    <p>If you didn’t request a password reset, please ignore this email.</p>
  `;

  return baseLayout(MailerTitle.RESET_PASSWORD, content);
};
