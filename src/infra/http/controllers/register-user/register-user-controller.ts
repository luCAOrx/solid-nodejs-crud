import { type Request, type Response } from "express";

import { UserAlreadyExistsError } from "@domain/use-cases/register-user/errors/user-already-exists-error";
import { RegisterUserUseCase } from "@domain/use-cases/register-user/register-user-use-case";
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

interface RegisterUserRequestBodyProps {
  name: string;
  job: string;
  email: string;
  password: string;
}

export class RegisterUserController {
  async handle(request: Request, response: Response): Promise<void> {
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

        return response.status(201).json({ user: userResponse });
      })
      .catch((error: Error) => {
        if (
          error instanceof UserAlreadyExistsError ||
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
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad request",
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
          return response.status(400).json({
            statusCode: 400,
            message:
              "The properties: name, job, email and password, should be provided in the request body",
            error: "Bad request",
          });
        }
      });
  }
}
