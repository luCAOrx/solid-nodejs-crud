export class EmailShouldBeValidEmailError extends Error {
  constructor() {
    super("The field email should be valid email");
    this.name = "EmailShouldBeValidEmailError";
  }
}
