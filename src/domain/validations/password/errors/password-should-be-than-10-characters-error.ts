export class PasswordShouldBeThan10CharactersError extends Error {
  constructor() {
    super("The field password should be than 5 characters");
    this.name = "PasswordShouldBeThan10CharactersError";
  }
}
