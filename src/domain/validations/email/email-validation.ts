import { EmailShouldBeLessThan255CharactersError } from "./errors/email-should-be-less-than-255-characters-error";
import { EmailShouldBeValidEmailError } from "./errors/email-should-be-valid-email-error";

export class EmailValidation {
  public email: string;

  public get value(): string {
    return this.email;
  }

  public set value(email: string) {
    this.email = email;
  }

  constructor(email: string) {
    this.email = email;
  }

  private static emailAddressRegexTest(email: string): boolean {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regex.test(email)) {
      return false;
    }

    return true;
  }

  static valid(email: string): string {
    const isValidEmail = this.emailAddressRegexTest(email);

    if (!isValidEmail) throw new EmailShouldBeValidEmailError();
    if (email.length > 255) throw new EmailShouldBeLessThan255CharactersError();

    return email;
  }
}
