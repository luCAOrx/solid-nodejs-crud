import { PasswordValidation } from "@domain/validations/password/password-validation";

export class Password {
  public get value(): string {
    return this.password;
  }

  public set value(password: string) {
    this.password = password;
  }

  private constructor(private password: string) {}

  static create(password: string): Password {
    const validatedPassword = PasswordValidation.valid(password);

    return new Password(validatedPassword);
  }
}
