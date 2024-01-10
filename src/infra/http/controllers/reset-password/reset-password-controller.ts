import { type Request, type Response } from "express";

import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { InvalidCodeToResetPasswordError } from "@domain/use-cases/reset-password/errors/invalid-code-to-reset-password-error";
import { PasswordResetTokenHasExpiredError } from "@domain/use-cases/reset-password/errors/password-reset-token-has-expired-error";
import { PasswordsDoNotMatchError } from "@domain/use-cases/reset-password/errors/passwords-do-not-match-error";
import { ResetPasswordUseCase } from "@domain/use-cases/reset-password/reset-password-use-case";
import { PasswordShouldBeLessThan255CharactersError } from "@domain/validations/password/errors/password-should-be-less-than-255-characters-error";
import { PasswordShouldBeThan10CharactersError } from "@domain/validations/password/errors/password-should-be-than-10-characters-error";
import { PasswordShouldNotBeEmptyError } from "@domain/validations/password/errors/password-should-not-be-empty-error";
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
          error instanceof UserNotFoundError ||
          error instanceof InvalidCodeToResetPasswordError ||
          error instanceof PasswordResetTokenHasExpiredError ||
          error instanceof PasswordsDoNotMatchError ||
          error instanceof PasswordShouldNotBeEmptyError ||
          error instanceof PasswordShouldBeThan10CharactersError ||
          error instanceof PasswordShouldBeLessThan255CharactersError
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
