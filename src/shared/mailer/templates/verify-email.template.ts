import { MailerTitle } from 'src/common/enums/mailer/mailer.enum';
import { baseLayout } from './base.layout';

export const verifyEmailTemplate = (name: string, link: string) => {
  const content = `
    <h2 style="margin-top: 0; color: #2d87f0;">Verify your email!</h2>
    <p>Hi ${name},</p>
    <p>To activate your account, please click the button below:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="${link}" style="background-color: #2d87f0; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
        Verify Now
      </a>
    </p>
    <p>If you did not register for an account, you can ignore this email.</p>
    <p style="margin-top: 32px;">Thank you,<br><strong>Your App Team</strong></p>
  `;

  return baseLayout(MailerTitle.VERIFY_EMAIL, content);
};
