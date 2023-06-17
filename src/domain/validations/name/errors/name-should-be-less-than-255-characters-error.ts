export class NameShouldBeLessThan255CharactersError extends Error {
  constructor() {
    super("The field name should be less than 255 characters");
    this.name = "NameShouldBeLessThan255CharactersError";
  }
}
