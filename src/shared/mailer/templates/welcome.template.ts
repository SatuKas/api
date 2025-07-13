import { baseLayout } from './base.layout';

export const welcomeEmailTemplate = (name: string) => {
  const content = `
    <h2 style="margin-top: 0; color: #2d87f0;">Welcome, ${name}!</h2>
    <p>Thank you for joining us. We're excited to have you on board!</p>
    <p>Your account has been successfully created and is ready to use. Feel free to start exploring our features.</p>
    <p>If you have any questions or need assistance, our support team is here to help you 😉</p>
    <p style="margin-top: 32px;">Happy exploring!<br><strong>Your App Team</strong></p>
  `;

  return baseLayout('Welcome to Our App!', content);
};
