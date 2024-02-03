export namespace RefreshJwtTokenUseCaseErrors {
  export class RefreshTokenNotFoundError extends Error {
    constructor() {
      super("RefreshTokenNotFound");

      this.message = "Refresh token not found";
    }
  }
}
