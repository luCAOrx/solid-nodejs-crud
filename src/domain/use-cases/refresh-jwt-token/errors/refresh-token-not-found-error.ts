export class RefreshTokenNotFoundError extends Error {
  constructor() {
    super("Refresh token not found");
    this.name = "RefreshTokenNotFoundError";
  }
}
