import { type Request, type Response } from "express";
import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";

import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";
import { UpdateUserUseCaseErrors } from "@domain/use-cases/update-user/erros/update-user-use-case-errors";
import { UpdateUserUseCase } from "@domain/use-cases/update-user/update-user-use-case";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

import { BaseController } from "../base-controller";

interface UpdateUserRouteParamsProps {
  id: string;
}

interface UpdateUserRequestBodyProps extends Request {
  name: string;
  job: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

export class UpdateUserController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
    const { id } = request.params as unknown as UpdateUserRouteParamsProps;
    const { name, job, email, currentPassword, newPassword } =
      request.body as UpdateUserRequestBodyProps;

    const prismaUserRepository = new PrismaUserRepository();
    const userSecurityProvider = new UserSecurityProvider();
    const updatedUserUseCase = new UpdateUserUseCase(
      prismaUserRepository,
      userSecurityProvider
    );

    await updatedUserUseCase
      .execute({
        id,
        data: {
          name,
          job,
          email,
          currentPassword,
          newPassword,
        },
      })
      .then(({ updatedUser }) => {
        const userResponse = UserViewModel.toHttp(updatedUser);

        return this.created({
          response,
          message: {
            user: userResponse,
          },
        });
      })
      .catch((error: Error) => {
        if (
          error instanceof GlobalUseCaseErrors.UserNotFoundError ||
          error instanceof GlobalUseCaseErrors.UserAlreadyExistsError ||
          error instanceof
            UpdateUserUseCaseErrors.TheCurrentPasswordIsInvalidError ||
          error instanceof ValueObjectErrors.ValueObjectShouldNotBeEmptyError ||
          error instanceof ValueObjectErrors.ValueObjectShouldBeLessThanError ||
          error instanceof
            ValueObjectErrors.ValueObjectShouldBeGreaterThanError ||
          error instanceof
            ValueObjectErrors.ValueObjectShouldBeValidValueObjectError
        ) {
          const message =
            error.message === "The current password is invalid"
              ? error.message
              : error.message.replace("password", "newPassword");

          return this.clientError({
            response,
            message,
          });
        }

        if (
          Object.keys(request.body).length === 0 ||
          !Object.hasOwn(request.body, "name") ||
          !Object.hasOwn(request.body, "job") ||
          !Object.hasOwn(request.body, "email") ||
          !Object.hasOwn(request.body, "currentPassword") ||
          !Object.hasOwn(request.body, "newPassword")
        ) {
          return this.clientError({
            response,
            message:
              "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          });
        }
      });
  }
}
