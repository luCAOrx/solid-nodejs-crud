import { type Request, type Response } from "express";

import { AuthenticateUserUseCase } from "@domain/use-cases/authenticate-user/authenticate-user-use-case";
import { InvalidEmailOrPasswordError } from "@domain/use-cases/authenticate-user/errors/invalid-email-or-password-error";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaRefreshTokenRepository } from "@infra/http/repositories/prisma-refresh-token-repository";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

interface AuthenticateUserRequestBodyProps {
  email: string;
  password: string;
}

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<void> {
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

        return response
          .status(201)
          .json({ user: userResponse, token, refreshToken });
      })
      .catch((error: Error) => {
        if (error instanceof InvalidEmailOrPasswordError) {
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad request",
          });
        }

        if (
          Object.keys(request.body).length === 0 ||
          Object.hasOwn(request.body, "email") ||
          Object.hasOwn(request.body, "password") ||
          !Object.hasOwn(request.body, "email") ||
          !Object.hasOwn(request.body, "password")
        ) {
          return response.status(400).json({
            statusCode: 400,
            message:
              "The properties: email and password, should be provided in the request body",
            error: "Bad request",
          });
        }
      });
  }
}
