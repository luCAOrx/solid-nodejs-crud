import { type SecurityProvider } from "@domain/providers/security-provider";
import {
  type RefreshTokenProps,
  type RefreshTokenRepository,
} from "@domain/repositories/refresh-token-repository";
import { type UserRepository } from "@domain/repositories/user-repository";
import { GenerateJwtToken } from "@domain/utils/jwt-token/generate-jwt-token";
import { GenerateRefreshToken } from "@domain/utils/refresh-token/generate-refresh-jwt-token";

import { BaseUseCase } from "../base-use-case";
import { RefreshTokenNotFoundError } from "./errors/refresh-token-not-found-error";

interface RefreshJwtTokenRequest {
  refreshTokenId: string;
}

interface RefreshJwtTokenResponse {
  refreshToken?: RefreshTokenProps;
  token: string;
}

export class RefreshJwtTokenUseCase extends BaseUseCase<
  RefreshJwtTokenRequest,
  RefreshJwtTokenResponse
> {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly securityProvider: SecurityProvider
  ) {
    super();
  }

  protected async execute({
    refreshTokenId,
  }: RefreshJwtTokenRequest): Promise<RefreshJwtTokenResponse> {
    const refreshTokenFound = await this.refreshTokenRepository.findById(
      refreshTokenId
    );

    if (refreshTokenFound === null) throw new RefreshTokenNotFoundError();

    const dateFromTimestamp = new Date(refreshTokenFound.expiresIn * 1000);
    const currentDate = new Date();
    const refreshTokenHasExpired = currentDate > dateFromTimestamp;

    const token = new GenerateJwtToken(this.securityProvider).execute({
      payload: { id: refreshTokenFound.userId },
    });

    if (refreshTokenHasExpired) {
      await this.refreshTokenRepository.delete(refreshTokenFound.userId);

      const { refreshToken } = await new GenerateRefreshToken(
        this.refreshTokenRepository,
        this.userRepository
      ).execute({ userId: refreshTokenFound.userId });

      return { refreshToken, token };
    }

    return { token };
  }
}
