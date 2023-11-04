import { type Request, type Response } from "express";

import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { RefreshTokenNotFoundError } from "@domain/use-cases/refresh-jwt-token/errors/refresh-token-not-found-error";
import { RefreshJwtTokenUseCase } from "@domain/use-cases/refresh-jwt-token/refresh-jwt-token-use-case";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaRefreshTokenRepository } from "@infra/http/repositories/prisma-refresh-token-repository";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { RefreshTokenViewModel } from "@infra/http/view-models/refresh-token-view-model";

interface RefreshJwtTokenControllerRequest {
  refreshToken: string;
}

export class RefreshJwtTokenController {
  async handle(request: Request, response: Response): Promise<void> {
    const { refreshToken } = request.body as RefreshJwtTokenControllerRequest;

    const prismaRefreshTokenRepository = new PrismaRefreshTokenRepository();
    const prismaUserRepository = new PrismaUserRepository();
    const userSecurityProvider = new UserSecurityProvider();
    const refreshJwtTokenUseCase = new RefreshJwtTokenUseCase(
      prismaRefreshTokenRepository,
      prismaUserRepository,
      userSecurityProvider
    );

    await refreshJwtTokenUseCase
      .execute({
        refreshTokenId: refreshToken,
      })
      .then(({ refreshToken, token }) => {
        const refreshTokenResponse = RefreshTokenViewModel.toHttp(refreshToken);

        return response
          .status(201)
          .json({ refreshToken: refreshTokenResponse, token });
      })
      .catch((error: Error) => {
        if (
          error instanceof RefreshTokenNotFoundError ||
          error instanceof UserNotFoundError
        ) {
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad request",
          });
        }

        if (
          Object.keys(request.body).length === 0 ||
          !Object.hasOwn(request.body, "refreshToken")
        ) {
          return response.status(400).json({
            statusCode: 400,
            message:
              "The property: refreshToken, should be provided in the request body",
            error: "Bad request",
          });
        }
      });
  }
}
