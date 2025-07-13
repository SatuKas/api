import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { MailerDriver } from '../mailer.interface';
import configuration from 'src/config/env.config';

@Injectable()
export class ResendMailer implements MailerDriver {
  async sendMail(to: string, subject: string, html: string) {
    const res = await axios.post(
      configuration().resendApiUrl,
      {
        from: configuration().resendFrom,
        to,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data;
  }
}
