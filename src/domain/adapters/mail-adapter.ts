export interface SendMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export abstract class MailAdapter {
  abstract sendMail: (options: SendMailOptions) => Promise<void>;
}
