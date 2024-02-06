import { randomUUID } from "node:crypto";

import {
  type RefreshTokenProps,
  type RefreshTokenRepository,
} from "@domain/repositories/refresh-token-repository";
import { type UserRepository } from "@domain/repositories/user-repository";
import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";

interface GenerateRefreshTokenRequest {
  userId: string;
}

interface GenerateRefreshTokenResponse {
  refreshToken: RefreshTokenProps;
}

export class GenerateRefreshToken {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute({
    userId,
  }: GenerateRefreshTokenRequest): Promise<GenerateRefreshTokenResponse> {
    const userFound = await this.userRepository.findById(userId);

    if (userFound === null) throw new GlobalUseCaseErrors.UserNotFoundError();

    const fifteenSecondsInUnixTimestamp = new Date().getTime() / 1000 + 15;

    const refreshToken = await this.refreshTokenRepository.create({
      id: randomUUID(),
      expiresIn: fifteenSecondsInUnixTimestamp,
      createdAt: new Date(),
      userId,
    });

    return { refreshToken };
  }
}
