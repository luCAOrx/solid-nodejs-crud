export namespace UpdateUserUseCaseErrors {
  export class TheCurrentPasswordIsInvalidError extends Error {
    constructor() {
      super("TheCurrentPasswordIsInvalid");

      this.message = "The current password is invalid";
    }
  }
}
