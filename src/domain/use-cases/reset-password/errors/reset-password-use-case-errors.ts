export namespace ResetPasswordUseCaseErrors {
  export class InvalidCodeToResetPasswordError extends Error {
    constructor() {
      super("InvalidCodeToResetPassword");

      this.message = "Invalid code to reset password";
    }
  }

  export class PasswordResetTokenHasExpiredError extends Error {
    constructor() {
      super("PasswordResetTokenHasExpired");

      this.message = "Password reset token has expired";
    }
  }

  export class PasswordsDoNotMatchError extends Error {
    constructor() {
      super("PasswordsDoNotMatch");

      this.message = "Passwords do not match";
    }
  }
}
