export class PasswordResetTokenHasExpiredError extends Error {
  constructor() {
    super("Password reset token has expired");
    this.name = "PasswordResetTokenHasExpiredError";
  }
}
