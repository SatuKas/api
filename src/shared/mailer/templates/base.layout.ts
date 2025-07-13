import configuration from 'src/config/env.config';

export const baseLayout = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 40px 0; font-family: 'Segoe UI', sans-serif; background-color: #f7f7f7; color: #333;">
    <div style="max-width: 600px; margin: 0 auto 40px; padding: 24px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      ${content}
    </div>
    <div style="max-width: 600px; margin: 0 auto; text-align: center; font-size: 12px; color: #999; padding: 16px 0;">
      <p style="margin: 0;">
        This email was sent automatically by the system. Please do not reply to this email.
      </p>
      <p style="margin: 4px 0 0;">© ${new Date().getFullYear()} ${configuration().appName}. All rights reserved.</p>
    </div>
  </body>
</html>
`;
