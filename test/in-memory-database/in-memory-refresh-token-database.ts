import {
  type RefreshTokenProps,
  type RefreshTokenRepository,
} from "@domain/repositories/refresh-token-repository";

export class InMemoryRefreshTokenDatabase implements RefreshTokenRepository {
  public refreshTokens: RefreshTokenProps[] = [];

  async exists(userId: string): Promise<boolean> {
    return this.refreshTokens.some(
      (refreshToken) => refreshToken.userId === userId
    );
  }

  async create(refreshToken: RefreshTokenProps): Promise<RefreshTokenProps> {
    this.refreshTokens.push(refreshToken);

    return refreshToken;
  }

  async findById(id: string): Promise<RefreshTokenProps | null> {
    const refreshToken = this.refreshTokens.find(
      (refreshToken) => refreshToken.id === id
    );

    if (refreshToken == null) return null;

    return refreshToken;
  }

  async delete(id: string): Promise<void> {
    const refreshToken = this.refreshTokens.findIndex(
      (refreshToken) => refreshToken.id === id
    );

    this.refreshTokens.splice(refreshToken, 1);
  }
}
