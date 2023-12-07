import {
  type SendMailOptions,
  type MailAdapter,
} from "@domain/adapters/mail-adapter";

export class UserMailAdapter implements MailAdapter {
  async sendMail(options: SendMailOptions): Promise<void> {
    await Promise.resolve();
  }
}
