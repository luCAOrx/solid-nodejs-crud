export class UserNotFoundError extends Error {
  constructor() {
    super("Uer not found");
    this.name = "UserNotFoundError";
  }
}
