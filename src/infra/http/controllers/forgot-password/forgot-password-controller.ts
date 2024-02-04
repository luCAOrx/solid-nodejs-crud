import { type Request, type Response } from "express";

import { ForgotPasswordUseCaseErrors } from "@domain/use-cases/forgot-password/errors/forgot-password-use-case-errors";
import { ForgotPasswordUseCase } from "@domain/use-cases/forgot-password/forgot-password-use-case";
import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";
import { NodeMailerMailAdapter } from "@infra/http/adapters/nodemailer-mail-adapter";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";

import { BaseController } from "../base-controller";

interface ForgotPasswordRequestBodyProps extends Request {
  email: string;
}

export class ForgotPasswordController extends BaseController {
  protected async executeImplementation(
    request: Request,
    response: Response
  ): Promise<any> {
    const { email } = request.body as ForgotPasswordRequestBodyProps;

    const prismaUserRepository = new PrismaUserRepository();
    const nodeMailerMailAdapter = new NodeMailerMailAdapter();
    const forgotPasswordUseCase = new ForgotPasswordUseCase(
      prismaUserRepository,
      nodeMailerMailAdapter
    );

    await forgotPasswordUseCase
      .execute({ email })
      .then(({ message }) => {
        return this.created({ response, message: { message } });
      })
      .catch((error: Error) => {
        if (
          error instanceof GlobalUseCaseErrors.UserNotFoundError ||
          error instanceof
            ForgotPasswordUseCaseErrors.UnableToSendPasswordRecoveryEmailError
        ) {
          return this.clientError({ response, message: error.message });
        }

        if (
          Object.keys(request.body).length === 0 ||
          !Object.hasOwn(request.body, "email")
        ) {
          return this.clientError({
            response,
            message:
              "The property: email should be provided in the request body",
          });
        }
      });
  }
}
