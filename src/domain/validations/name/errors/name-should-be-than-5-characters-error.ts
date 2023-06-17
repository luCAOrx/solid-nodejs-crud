export class NameShouldBeThan5CharactersError extends Error {
  constructor() {
    super("The field name should be than 5 characters");
    this.name = "NameShouldBeThan5CharactersError";
  }
}
