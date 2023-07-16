import { compare } from "bcryptjs";
import { type Request, type Response } from "express";

import { AuthenticateUserUseCase } from "@domain/use-cases/authenticate-user/authenticate-user-use-case";
import { InvalidEmailOrPasswordError } from "@domain/use-cases/authenticate-user/errors/invalid-email-or-password-error";
import { GenerateTokenProvider } from "@infra/http/providers/generate-token-provider";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

interface AuthenticateUserRequestBodyProps {
  email: string;
  password: string;
}

export class AuthenticateUserController {
  async handle(
    request: Request,
    response: Response
  ): Promise<Response<any, Record<string, any>> | undefined> {
    const { email, password } =
      request.body as AuthenticateUserRequestBodyProps;

    const prismaUserRepository = new PrismaUserRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(
      prismaUserRepository
    );

    try {
      const userFounded = await prismaUserRepository.findByEmail(email);

      const isPasswordSameSaveInDatabase = await compare(
        password,
        String(userFounded?.props.password)
      );

      const { user } = await authenticateUserUseCase.execute({
        email,
        password,
        isPasswordSameSaveInDatabase,
      });
      const userResponse = UserViewModel.toHttp(user);

      const token = GenerateTokenProvider.execute({ id: user.id });

      return response.status(201).json({ user: userResponse, token });
    } catch (error) {
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
        Object.hasOwn(request.body, "password")
      ) {
        return response.status(500).json({
          statusCode: 500,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      }
    }
  }
}
