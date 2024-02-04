import { type Request, type Response } from "express";

import { GetUsersUseCaseErrors } from "@domain/use-cases/get-users/errors/get-users-use-case-errors";
import { GetUsersUseCase } from "@domain/use-cases/get-users/get-users-use-case";
import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

import { BaseController } from "../base-controller";

interface GetUserRouteParamsProps {
  id: string;
}

interface GetUserQueryParamsProps {
  page: string;
  takePage: string;
}

export class GetUsersController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
    const { id } = request.params as unknown as GetUserRouteParamsProps;

    const { page, takePage } =
      request.query as unknown as GetUserQueryParamsProps;

    const prismaUserRepository = new PrismaUserRepository();
    const getUsersUseCase = new GetUsersUseCase(prismaUserRepository);

    await getUsersUseCase
      .execute({ id, page: Number(page), takePage: Number(takePage) })
      .then((user) => {
        const userOrUsers = user.map((user) => {
          return UserViewModel.toHttp(user);
        });

        return this.ok({ response, message: { userOrUsers } });
      })
      .catch((error: Error) => {
        if (
          error instanceof GlobalUseCaseErrors.UserNotFoundError ||
          error instanceof GetUsersUseCaseErrors.AccessDeniedError
        ) {
          return this.clientError({ response, message: error.message });
        }

        if (
          Object.keys(request.query).length === 0 ||
          Object.hasOwn(request.query, "page") ||
          Object.hasOwn(request.query, "takePage") ||
          !Object.hasOwn(request.query, "page") ||
          !Object.hasOwn(request.query, "takePage")
        ) {
          return this.clientError({
            response,
            message:
              "The query parameters: page and takePage, must be provided in the query parameters of the request",
          });
        }
      });
  }
}
