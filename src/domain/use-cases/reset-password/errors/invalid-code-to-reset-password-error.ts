export class InvalidCodeToResetPasswordError extends Error {
  constructor() {
    super("Invalid code to reset password");
    this.name = "InvalidCodeToResetPasswordError";
  }
}
