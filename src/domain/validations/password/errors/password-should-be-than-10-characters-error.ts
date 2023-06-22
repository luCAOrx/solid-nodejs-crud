export class PasswordShouldBeThan10CharactersError extends Error {
  constructor() {
    super("The field password should be than 10 characters");
    this.name = "PasswordShouldBeThan10CharactersError";
  }
}
