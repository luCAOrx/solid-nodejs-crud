export class UnableToSendPasswordRecoveryEmailError extends Error {
  constructor() {
    super("Unable to send password recovery email");
    this.name = "UnableToSendPasswordRecoveryEmailError";
  }
}
