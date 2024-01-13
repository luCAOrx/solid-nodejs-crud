import { type User } from "@domain/entities/user/user";
import { type SecurityProvider } from "@domain/providers/security-provider";
import {
  type RefreshTokenRepository,
  type RefreshTokenProps,
} from "@domain/repositories/refresh-token-repository";
import { type UserRepository } from "@domain/repositories/user-repository";
import { GenerateJwtToken } from "@domain/utils/jwt-token/generate-jwt-token";
import { GenerateRefreshToken } from "@domain/utils/refresh-token/generate-refresh-jwt-token";

import { BaseUseCase } from "../base-use-case";
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

export class AuthenticateUserUseCase extends BaseUseCase<
  AuthenticateUserRequest,
  AuthenticateUserResponse
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityProvider: SecurityProvider,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {
    super();
  }

  protected async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const userOrNull = await this.userRepository.findByEmail(email);

    if (userOrNull === null) throw new InvalidEmailOrPasswordError();

    const isPasswordSameSaveInDatabase = await this.securityProvider.compare({
      password,
      hashedPassword: userOrNull.props.password,
    });

    if (!isPasswordSameSaveInDatabase) throw new InvalidEmailOrPasswordError();

    const refreshTokenAlreadyExists = await this.refreshTokenRepository.exists(
      userOrNull.id
    );

    const token = new GenerateJwtToken(this.securityProvider).execute({
      payload: { id: userOrNull.id },
    });

    if (refreshTokenAlreadyExists) {
      await this.refreshTokenRepository.delete(userOrNull.id);

      const { refreshToken } = await new GenerateRefreshToken(
        this.refreshTokenRepository,
        this.userRepository
      ).execute({
        userId: userOrNull.id,
      });

      return { user: userOrNull, token, refreshToken };
    }

    const { refreshToken } = await new GenerateRefreshToken(
      this.refreshTokenRepository,
      this.userRepository
    ).execute({
      userId: userOrNull.id,
    });

    return { user: userOrNull, token, refreshToken };
  }
}
