import { type Request, type Response } from "express";

import { DeleteUserUseCase } from "@domain/use-cases/delete-user/delete-user-use-case";
import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";

import { BaseController } from "../base-controller";

interface DeleteUserRouteParamsProps {
  id: string;
}

export class DeleteUserController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
    const { id } = request.params as unknown as DeleteUserRouteParamsProps;

    const prismaUserRepository = new PrismaUserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(prismaUserRepository);

    await deleteUserUseCase
      .execute({ id })
      .then(() => {
        return this.noContent({ response });
      })
      .catch((error: Error) => {
        if (error instanceof UserNotFoundError) {
          return this.clientError({ response, message: error.message });
        }
      });
  }
}
