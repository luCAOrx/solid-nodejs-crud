import { type Request, type Response } from "express";
import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";

import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";
import { ResetPasswordUseCaseErrors } from "@domain/use-cases/reset-password/errors/reset-password-use-case-errors";
import { ResetPasswordUseCase } from "@domain/use-cases/reset-password/reset-password-use-case";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";

import { BaseController } from "../base-controller";

interface ResetPasswordRequestBodyProps {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export class ResetPasswordController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
    const { email, code, confirmPassword, newPassword } =
      request.body as ResetPasswordRequestBodyProps;

    const prismaUserRepository = new PrismaUserRepository();
    const userSecurityProvider = new UserSecurityProvider();

    const resetPasswordUseCase = new ResetPasswordUseCase(
      prismaUserRepository,
      userSecurityProvider
    );

    await resetPasswordUseCase
      .execute({
        email,
        code,
        newPassword,
        confirmPassword,
      })
      .then(({ message }) => {
        return this.created({ response, message: { message } });
      })
      .catch((error: Error) => {
        if (
          error instanceof GlobalUseCaseErrors.UserNotFoundError ||
          error instanceof
            ResetPasswordUseCaseErrors.InvalidCodeToResetPasswordError ||
          error instanceof
            ResetPasswordUseCaseErrors.PasswordResetTokenHasExpiredError ||
          error instanceof
            ResetPasswordUseCaseErrors.PasswordsDoNotMatchError ||
          error instanceof ValueObjectErrors.ValueObjectShouldNotBeEmptyError ||
          error instanceof ValueObjectErrors.ValueObjectShouldBeLessThanError ||
          error instanceof ValueObjectErrors.ValueObjectShouldBeGreaterThanError
        ) {
          const message = error.message.startsWith("The field password")
            ? error.message.replace("password", "newPassword")
            : error.message;

          return this.clientError({
            response,
            message,
          });
        }

        if (
          Object.keys(request.body).length === 0 ||
          !Object.hasOwn(request.body, "email") ||
          !Object.hasOwn(request.body, "newPassword")
        ) {
          return this.clientError({
            response,
            message:
              "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          });
        }
      });
  }
}
