import nodemailer from "nodemailer";

import {
  type SendMailOptions,
  type MailAdapter,
} from "@domain/adapters/mail-adapter";

const transport = nodemailer.createTransport({
  host: String(process.env.SMTP_HOST),
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export class NodeMailerMailAdapter implements MailAdapter {
  async sendMail({
    from,
    html,
    subject,
    text,
    to,
  }: SendMailOptions): Promise<void> {
    await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  }
}
