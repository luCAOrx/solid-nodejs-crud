import { type Request, type Response } from "express";

import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { GetUserUseCase } from "@domain/use-cases/get-user/get-user-use-case";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

export class GetUserController {
  async handle(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const prismaUserRepository = new PrismaUserRepository();
    const getUserUseCase = new GetUserUseCase(prismaUserRepository);

    await getUserUseCase
      .execute({ id })
      .then(({ user }) => {
        const userResponse = UserViewModel.toHttp(user);

        return response.status(200).json(userResponse);
      })
      .catch((error: Error) => {
        if (error instanceof UserNotFoundError) {
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad request",
          });
        }
      });
  }
}
