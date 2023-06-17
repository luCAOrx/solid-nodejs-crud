export class PasswordShouldBeLessThan255CharactersError extends Error {
  constructor() {
    super("The field password should be less than 255 characters");
    this.name = "PasswordShouldBeLessThan255CharactersError";
  }
}
