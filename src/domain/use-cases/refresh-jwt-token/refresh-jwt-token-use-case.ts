import { type SecurityProvider } from "@domain/providers/security-provider";
import {
  type RefreshTokenProps,
  type RefreshTokenRepository,
} from "@domain/repositories/refresh-token-repository";
import { type UserRepository } from "@domain/repositories/user-repository";
import { GenerateJwtToken } from "@domain/utils/jwt-token/generate-jwt-token";
import { GenerateRefreshToken } from "@domain/utils/refresh-token/generate-refresh-jwt-token";

import { RefreshTokenNotFoundError } from "./errors/refresh-token-not-found-error";

interface RefreshJwtTokenRequest {
  refreshTokenId: string;
}

interface RefreshJwtTokenResponse {
  refreshToken: RefreshTokenProps;
  tokenJwt: string;
}

export class RefreshJwtTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly securityProvider: SecurityProvider
  ) {}

  async execute({
    refreshTokenId,
  }: RefreshJwtTokenRequest): Promise<RefreshJwtTokenResponse> {
    const refreshTokenFound = await this.refreshTokenRepository.findById(
      refreshTokenId
    );

    if (refreshTokenFound === null) throw new RefreshTokenNotFoundError();

    const sixteenSecondsInUnixTimestamp = new Date().getTime() / 1000 + 16;

    const refreshTokenHasExpired =
      sixteenSecondsInUnixTimestamp > refreshTokenFound.expiresIn;

    if (refreshTokenHasExpired) {
      await this.refreshTokenRepository.delete(refreshTokenFound.userId);
    }

    const { refreshToken } = await new GenerateRefreshToken(
      this.refreshTokenRepository,
      this.userRepository
    ).execute({ userId: refreshTokenFound.userId });

    const tokenJwt = new GenerateJwtToken(this.securityProvider).execute({
      payload: refreshTokenFound.userId,
    });

    return { refreshToken, tokenJwt };
  }
}
