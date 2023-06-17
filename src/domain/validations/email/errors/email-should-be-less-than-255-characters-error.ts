export class EmailShouldBeLessThan255CharactersError extends Error {
  constructor() {
    super("The field email should be less than 255 characters");
    this.name = "EmailShouldBeLessThan255CharactersError";
  }
}
