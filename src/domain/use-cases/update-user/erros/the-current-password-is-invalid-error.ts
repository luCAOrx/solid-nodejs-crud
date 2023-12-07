export class TheCurrentPasswordIsInvalidError extends Error {
  constructor() {
    super("The current password is invalid");
    this.name = "TheCurrentPasswordIsInvalidError";
  }
}
