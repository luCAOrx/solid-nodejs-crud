import { type User } from "@domain/entities/user/user";
import { type SecurityProvider } from "@domain/providers/security-provider";
import {
  type RefreshTokenRepository,
  type RefreshTokenProps,
} from "@domain/repositories/refresh-token-repository";
import { type UserRepository } from "@domain/repositories/user-repository";
import { GenerateJwtToken } from "@domain/utils/jwt-token/generate-jwt-token";
import { GenerateRefreshToken } from "@domain/utils/refresh-token/generate-refresh-jwt-token";

import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: User;
  token: string;
  refreshToken: RefreshTokenProps;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityProvider: SecurityProvider,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const userOrNull = await this.userRepository.findByEmail(email);

    const isPasswordSameSaveInDatabase = await this.securityProvider.compare({
      password,
      hash: String(userOrNull?.props.password),
    });

    if (userOrNull === null || !isPasswordSameSaveInDatabase)
      throw new InvalidEmailOrPasswordError();

    const token = new GenerateJwtToken(this.securityProvider).execute({
      payload: userOrNull.id,
    });

    await this.refreshTokenRepository.delete(userOrNull.id);

    const { refreshToken } = await new GenerateRefreshToken(
      this.refreshTokenRepository,
      this.userRepository
    ).execute({
      userId: userOrNull.id,
    });

    return { user: userOrNull, token, refreshToken };
  }
}
