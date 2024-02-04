import { type Request, type Response } from "express";

import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";
import { RefreshJwtTokenUseCaseErrors } from "@domain/use-cases/refresh-jwt-token/errors/refresh-jwt-token-use-case-errors";
import { RefreshJwtTokenUseCase } from "@domain/use-cases/refresh-jwt-token/refresh-jwt-token-use-case";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaRefreshTokenRepository } from "@infra/http/repositories/prisma-refresh-token-repository";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { RefreshTokenViewModel } from "@infra/http/view-models/refresh-token-view-model";

import { BaseController } from "../base-controller";

interface RefreshJwtTokenControllerRequest {
  refreshToken: string;
}

export class RefreshJwtTokenController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
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

        return this.created({
          response,
          message: {
            refreshToken: refreshTokenResponse,
            token,
          },
        });
      })
      .catch((error: Error) => {
        if (
          error instanceof
            RefreshJwtTokenUseCaseErrors.RefreshTokenNotFoundError ||
          error instanceof GlobalUseCaseErrors.UserNotFoundError
        ) {
          return this.clientError({ response, message: error.message });
        }

        if (
          Object.keys(request.body).length === 0 ||
          !Object.hasOwn(request.body, "refreshToken")
        ) {
          return this.clientError({
            response,
            message:
              "The property: refreshToken, should be provided in the request body",
          });
        }
      });
  }
}
