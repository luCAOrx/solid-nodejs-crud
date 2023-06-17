export class NameShouldNotBeEmptyError extends Error {
  constructor() {
    super("The field name should not be empty");
    this.name = "NameShouldNotBeEmptyError";
  }
}
