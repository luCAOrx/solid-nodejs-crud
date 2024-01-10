import { type Request, type Response } from "express";

import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { GetUserUseCase } from "@domain/use-cases/get-user/get-user-use-case";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

import { BaseController } from "../base-controller";

interface GetUserRouteParamsProps {
  id: string;
}

export class GetUserController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
    const { id } = request.params as unknown as GetUserRouteParamsProps;

    const prismaUserRepository = new PrismaUserRepository();
    const getUserUseCase = new GetUserUseCase(prismaUserRepository);

    await getUserUseCase
      .execute({ id })
      .then(({ user }) => {
        const userResponse = UserViewModel.toHttp(user);

        return this.ok({ response, message: userResponse });
      })
      .catch((error: Error) => {
        if (error instanceof UserNotFoundError) {
          return this.clientError({ response, message: error.message });
        }
      });
  }
}
