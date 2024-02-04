import { type Request, type Response } from "express";
import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";

import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";
import { RegisterUserUseCase } from "@domain/use-cases/register-user/register-user-use-case";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

import { BaseController } from "../base-controller";

interface RegisterUserRequestBodyProps {
  name: string;
  job: string;
  email: string;
  password: string;
}

export class RegisterUserController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
    const { name, job, email, password } =
      request.body as RegisterUserRequestBodyProps;

    const prismaUserRepository = new PrismaUserRepository();
    const userSecurityProvider = new UserSecurityProvider();

    const registerUserUseCase = new RegisterUserUseCase(
      prismaUserRepository,
      userSecurityProvider
    );

    await registerUserUseCase
      .execute({
        name,
        job,
        email,
        password,
      })
      .then(({ user }) => {
        const userResponse = UserViewModel.toHttp(user);

        return this.created({
          response,
          message: {
            user: userResponse,
          },
        });
      })
      .catch((error: Error) => {
        if (
          error instanceof GlobalUseCaseErrors.UserAlreadyExistsError ||
          error instanceof ValueObjectErrors.ValueObjectShouldNotBeEmptyError ||
          error instanceof ValueObjectErrors.ValueObjectShouldBeLessThanError ||
          error instanceof
            ValueObjectErrors.ValueObjectShouldBeGreaterThanError ||
          error instanceof
            ValueObjectErrors.ValueObjectShouldBeValidValueObjectError
        ) {
          return this.clientError({
            response,
            message: error.message,
          });
        }

        if (
          Object.keys(request.body).length === 0 ||
          Object.hasOwn(request.body, "name") ||
          Object.hasOwn(request.body, "job") ||
          Object.hasOwn(request.body, "email") ||
          Object.hasOwn(request.body, "password") ||
          !Object.hasOwn(request.body, "name") ||
          !Object.hasOwn(request.body, "job") ||
          !Object.hasOwn(request.body, "email") ||
          !Object.hasOwn(request.body, "password")
        ) {
          return this.clientError({
            response,
            message:
              "The properties: name, job, email and password, should be provided in the request body",
          });
        }
      });
  }
}
