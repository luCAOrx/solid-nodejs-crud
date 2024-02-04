import { type Request, type Response } from "express";

import AuthenticateUserUseCase from "@domain/use-cases/authenticate-user/authenticate-user-use-case";
import { AuthenticateUserUseCaseErrors } from "@domain/use-cases/authenticate-user/errors/authenticate-user-use-case-errors";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaRefreshTokenRepository } from "@infra/http/repositories/prisma-refresh-token-repository";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

import { BaseController } from "../base-controller";

interface AuthenticateUserRequestBodyProps {
  email: string;
  password: string;
}

export class AuthenticateUserController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<void> {
    const { email, password } =
      request.body as AuthenticateUserRequestBodyProps;

    const prismaUserRepository = new PrismaUserRepository();
    const userSecurityProvider = new UserSecurityProvider();
    const prismaRefreshTokenRepository = new PrismaRefreshTokenRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(
      prismaUserRepository,
      userSecurityProvider,
      prismaRefreshTokenRepository
    );

    await authenticateUserUseCase
      .execute({
        email,
        password,
      })
      .then(({ user, token, refreshToken }) => {
        const userResponse = UserViewModel.toHttp(user);

        return this.created({
          response,
          message: {
            user: userResponse,
            token,
            refreshToken,
          },
        });
      })
      .catch((error: Error) => {
        if (
          error instanceof
          AuthenticateUserUseCaseErrors.InvalidEmailOrPasswordError
        ) {
          return this.clientError({ response, message: error.message });
        }

        if (
          Object.keys(request.body).length === 0 ||
          Object.hasOwn(request.body, "email") ||
          Object.hasOwn(request.body, "password") ||
          !Object.hasOwn(request.body, "email") ||
          !Object.hasOwn(request.body, "password")
        ) {
          return this.clientError({
            response,
            message:
              "The properties: email and password, should be provided in the request body",
          });
        }
      });
  }
}
