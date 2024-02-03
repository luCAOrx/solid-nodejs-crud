export namespace ForgotPasswordUseCaseErrors {
  export class UnableToSendPasswordRecoveryEmailError extends Error {
    constructor() {
      super("UnableToSendPasswordRecoveryEmail");

      this.message = "Unable to send password recovery email";
    }
  }
}
