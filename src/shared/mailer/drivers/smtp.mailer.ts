import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerDriver } from '../mailer.interface';
import configuration from 'src/config/env.config';

@Injectable()
export class SmtpMailer implements MailerDriver {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configuration().smtpHost,
      port: configuration().smtpPort,
      secure: false,
      auth: {
        user: configuration().smtpUsername,
        pass: configuration().smtpPassword,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: configuration().smtpFrom || configuration().smtpUsername,
      to,
      subject,
      html,
    });
  }
}
