export namespace GlobalUseCaseErrors {
  export class UserNotFoundError extends Error {
    constructor() {
      super("UserNotFound");

      this.message = "User not found";
    }
  }

  export class UserAlreadyExistsError extends Error {
    constructor() {
      super("TheUserAlreadyExists");

      this.message = "The user already exists";
    }
  }
}
