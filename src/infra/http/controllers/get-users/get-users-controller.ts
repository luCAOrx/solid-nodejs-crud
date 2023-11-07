import { type Request, type Response } from "express";

import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { AccessDeniedError } from "@domain/use-cases/get-users/errors/access-denied-error";
import { GetUsersUseCase } from "@domain/use-cases/get-users/get-users-use-case";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

interface GetUserRouteParamsProps {
  id: string;
}

interface GetUserQueryParamsProps {
  page: string;
  takePage: string;
}

export class GetUsersController {
  async handle(request: Request, response: Response): Promise<void> {
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

        return response.status(200).json({ userOrUsers });
      })
      .catch((error: Error) => {
        if (
          error instanceof UserNotFoundError ||
          error instanceof AccessDeniedError
        ) {
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad request",
          });
        }

        if (
          Object.keys(request.query).length === 0 ||
          Object.hasOwn(request.query, "page") ||
          Object.hasOwn(request.query, "takePage") ||
          !Object.hasOwn(request.query, "page") ||
          !Object.hasOwn(request.query, "takePage")
        ) {
          return response.status(400).json({
            statusCode: 400,
            message:
              "The query parameters: page and takePage, must be provided in the query parameters of the request",
            error: "Bad request",
          });
        }
      });
  }
}
