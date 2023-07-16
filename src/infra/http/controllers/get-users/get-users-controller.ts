import { type Request, type Response } from "express";

import { GetUsersUseCase } from "@domain/use-cases/get-users/get-users-use-case";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

interface GetUserQueryParamsProps {
  page: string;
  takePage: string;
}

export class GetUsersController {
  async handle(request: Request, response: Response): Promise<void> {
    const { page, takePage } =
      request.query as unknown as GetUserQueryParamsProps;

    const prismaUserRepository = new PrismaUserRepository();
    const getUsersUseCase = new GetUsersUseCase(prismaUserRepository);

    await getUsersUseCase
      .execute({ page: Number(page), takePage: Number(takePage) })
      .then((user) => {
        const userOrUsers = user.map((user) => {
          return UserViewModel.toHttp(user);
        });

        return response.status(200).json({ userOrUsers });
      })
      .catch(() => {
        if (
          Object.keys(request.query).length === 0 ||
          Object.hasOwn(request.query, "page") ||
          Object.hasOwn(request.query, "takePage")
        ) {
          return response.status(500).json({
            statusCode: 500,
            message:
              "The query parameters: page and takePage, must be provided in the query parameters of the request",
            error: "Internal Server Error",
          });
        }

        return response.status(400).json({
          statusCode: 400,
          message: "Error listing users",
          error: "Bad request",
        });
      });
  }
}
