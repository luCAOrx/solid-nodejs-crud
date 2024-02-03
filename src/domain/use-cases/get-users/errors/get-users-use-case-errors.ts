export namespace GetUsersUseCaseErrors {
  export class AccessDeniedError extends Error {
    constructor() {
      super("AccessDenied");

      this.message = "Access denied";
    }
  }
}
