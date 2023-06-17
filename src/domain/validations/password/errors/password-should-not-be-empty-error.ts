export class PasswordShouldNotBeEmptyError extends Error {
  constructor() {
    super("The field password should not be empty");
    this.name = "PasswordShouldNotBeEmptyError";
  }
}
