import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ResendMailer } from './drivers/resend.mailer';
import { SmtpMailer } from './drivers/smtp.mailer';

@Global()
@Module({
  providers: [MailerService, ResendMailer, SmtpMailer],
  exports: [MailerService],
})
export class MailerModule {}
