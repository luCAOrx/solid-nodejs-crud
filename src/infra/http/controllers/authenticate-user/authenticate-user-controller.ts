import { compare } from "bcryptjs";
import { type Request, type Response } from "express";

import { AuthenticateUserUseCase } from "@domain/use-cases/authenticate-user/authenticate-user-use-case";
import { InvalidEmailOrPasswordError } from "@domain/use-cases/authenticate-user/errors/invalid-email-or-password-error";
import { GenerateTokenProvider } from "@infra/http/providers/generate-token-provider";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;

    const prismaUserRepository = new PrismaUserRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(
      prismaUserRepository
    );

    const user = await prismaUserRepository.findByEmail(email);

    const isPasswordSameSaveInDatabase = await compare(
      password,
      String(user?.props.password)
    );

    await authenticateUserUseCase
      .execute({
        email,
        password,
        isPasswordSameSaveInDatabase,
      })
      .then(({ user }) => {
        const userResponse = UserViewModel.toHttp(user);

        const token = GenerateTokenProvider.execute({ id: user.id });

        return response.status(201).json({ user: userResponse, token });
      })
      .catch((error: Error) => {
        if (error instanceof InvalidEmailOrPasswordError) {
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad request",
          });
        }
      });
  }
}
