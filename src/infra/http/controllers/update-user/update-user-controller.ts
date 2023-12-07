import { type Request, type Response } from "express";

import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { UserAlreadyExistsError } from "@domain/use-cases/register-user/errors/user-already-exists-error";
import { TheCurrentPasswordIsInvalidError } from "@domain/use-cases/update-user/erros/the-current-password-is-invalid-error";
import { UpdateUserUseCase } from "@domain/use-cases/update-user/update-user-use-case";
import { EmailShouldBeLessThan255CharactersError } from "@domain/validations/email/errors/email-should-be-less-than-255-characters-error";
import { EmailShouldBeValidEmailError } from "@domain/validations/email/errors/email-should-be-valid-email-error";
import { JobShouldBeLessThan255CharactersError } from "@domain/validations/job/errors/job-should-be-less-than-255-characters-error";
import { JobShouldBeThan5CharactersError } from "@domain/validations/job/errors/job-should-be-than-5-characters-error";
import { JobShouldNotBeEmptyError } from "@domain/validations/job/errors/job-should-not-be-empty-error";
import { NameShouldBeLessThan255CharactersError } from "@domain/validations/name/errors/name-should-be-less-than-255-characters-error";
import { NameShouldBeThan5CharactersError } from "@domain/validations/name/errors/name-should-be-than-5-characters-error";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { PasswordShouldBeLessThan255CharactersError } from "@domain/validations/password/errors/password-should-be-less-than-255-characters-error";
import { PasswordShouldBeThan10CharactersError } from "@domain/validations/password/errors/password-should-be-than-10-characters-error";
import { PasswordShouldNotBeEmptyError } from "@domain/validations/password/errors/password-should-not-be-empty-error";
import { UserSecurityProvider } from "@infra/http/providers/user-security-provider";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";
import { UserViewModel } from "@infra/http/view-models/user-view-model";

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

export class UpdateUserController {
  async handle(request: Request, response: Response): Promise<void> {
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

        return response.status(201).json({ user: userResponse });
      })
      .catch((error: Error) => {
        if (
          error instanceof UserNotFoundError ||
          error instanceof UserAlreadyExistsError ||
          error instanceof TheCurrentPasswordIsInvalidError ||
          error instanceof NameShouldNotBeEmptyError ||
          error instanceof NameShouldBeLessThan255CharactersError ||
          error instanceof NameShouldBeThan5CharactersError ||
          error instanceof JobShouldNotBeEmptyError ||
          error instanceof JobShouldBeLessThan255CharactersError ||
          error instanceof JobShouldBeThan5CharactersError ||
          error instanceof EmailShouldBeValidEmailError ||
          error instanceof EmailShouldBeLessThan255CharactersError ||
          error instanceof PasswordShouldNotBeEmptyError ||
          error instanceof PasswordShouldBeLessThan255CharactersError ||
          error instanceof PasswordShouldBeThan10CharactersError
        ) {
          const message =
            error.message === "The current password is invalid"
              ? error.message
              : error.message.replace("password", "newPassword");

          return response.status(400).json({
            statusCode: 400,
            message,
            error: "Bad request",
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
          return response.status(400).json({
            statusCode: 400,
            message:
              "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
            error: "Bad request",
          });
        }
      });
  }
}
