export namespace AuthenticateUserUseCaseErrors {
  export class InvalidEmailOrPasswordError extends Error {
    constructor() {
      super("InvalidEmailOrPasswordError");

      this.message = "Invalid email or password";
    }
  }
}
