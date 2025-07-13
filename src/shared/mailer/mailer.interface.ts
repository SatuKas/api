export interface MailerDriver {
  sendMail(to: string, subject: string, html: string): Promise<any>;
}
