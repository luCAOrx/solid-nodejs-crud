import { type Request, type Response } from "express";

import { DeleteUserUseCase } from "@domain/use-cases/delete-user/delete-user-use-case";
import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";

interface DeleteUserRouteParamsProps {
  id: string;
}

export class DeleteUserController {
  async handle(request: Request, response: Response): Promise<void> {
    const { id } = request.params as unknown as DeleteUserRouteParamsProps;

    const prismaUserRepository = new PrismaUserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(prismaUserRepository);

    await deleteUserUseCase
      .execute({ id })
      .then(() => response.status(204).end())
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
