import { EmailValidation } from "@domain/validations/email/email-validation";

export class Email {
  public get value(): string {
    return this.email;
  }

  public set value(email: string) {
    this.email = email;
  }

  private constructor(private email: string) {}

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  static create(email: string): Email {
    const formattedEmail = this.format(email);

    const validatedEmail = EmailValidation.valid(formattedEmail);

    return new Email(validatedEmail);
  }
}
