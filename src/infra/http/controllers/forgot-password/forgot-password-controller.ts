import { type Request, type Response } from "express";

import { UserNotFoundError } from "@domain/use-cases/errors/user-not-found-error";
import { UnableToSendPasswordRecoveryEmailError } from "@domain/use-cases/forgot-password/errors/unable-to-send-password-recovery-email-error";
import { ForgotPasswordUseCase } from "@domain/use-cases/forgot-password/forgot-password-use-case";
import { NodeMailerMailAdapter } from "@infra/http/adapters/nodemailer-mail-adapter";
import { PrismaUserRepository } from "@infra/http/repositories/prisma-user-repository";

interface ForgotPasswordRequestBodyProps extends Request {
  email: string;
}

export class ForgotPasswordController {
  async handle(request: Request, response: Response): Promise<void> {
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
        return response.status(201).json({ message });
      })
      .catch((error: Error) => {
        if (
          error instanceof UserNotFoundError ||
          error instanceof UnableToSendPasswordRecoveryEmailError
        ) {
          return response.status(400).json({
            statusCode: 400,
            message: error.message,
            error: "Bad request",
          });
        }

        if (
          Object.keys(request.body).length === 0 ||
          !Object.hasOwn(request.body, "email")
        ) {
          return response.status(400).json({
            statusCode: 400,
            message:
              "The property: email should be provided in the request body",
            error: "Bad request",
          });
        }
      });
  }
}
