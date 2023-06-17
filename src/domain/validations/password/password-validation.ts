import { PasswordShouldBeLessThan255CharactersError } from "./errors/password-should-be-less-than-255-characters-error";
import { PasswordShouldBeThan10CharactersError } from "./errors/password-should-be-than-10-characters-error";
import { PasswordShouldNotBeEmptyError } from "./errors/password-should-not-be-empty-error";

export class PasswordValidation {
  public password: string;

  public get value(): string {
    return this.password;
  }

  public set value(password: string) {
    this.password = password;
  }

  constructor(password: string) {
    this.password = password;
  }

  static valid(password: string): string {
    if (password.length === 0) throw new PasswordShouldNotBeEmptyError();
    if (password.length > 255)
      throw new PasswordShouldBeLessThan255CharactersError();
    if (password.length < 10) throw new PasswordShouldBeThan10CharactersError();

    return password;
  }
}
