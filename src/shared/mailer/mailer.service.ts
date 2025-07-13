import { Injectable } from '@nestjs/common';
import { ResendMailer } from './drivers/resend.mailer';
import { SmtpMailer } from './drivers/smtp.mailer';
import { MailerDriver } from './mailer.interface';
import configuration from 'src/config/env.config';

@Injectable()
export class MailerService {
  private driver: MailerDriver;

  constructor(
    private readonly resendMailer: ResendMailer,
    private readonly smtpMailer: SmtpMailer,
  ) {
    const useResend = configuration().mailDriver === 'resend';
    this.driver = useResend ? this.resendMailer : this.smtpMailer;
  }

  sendMail(to: string, subject: string, html: string) {
    return this.driver.sendMail(to, subject, html);
  }
}
