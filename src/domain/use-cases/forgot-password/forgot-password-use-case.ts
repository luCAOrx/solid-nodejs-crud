import { randomBytes } from "node:crypto";

import { type MailAdapter } from "@domain/adapters/mail-adapter";
import { type UserRepository } from "@domain/repositories/user-repository";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { UnableToSendPasswordRecoveryEmailError } from "./errors/unable-to-send-password-recovery-email-error";

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailAdapter: MailAdapter
  ) {}

  async execute({
    email,
  }: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const userFound = await this.userRepository.findByEmail(email);

    if (userFound === null) throw new UserNotFoundError();

    const passwordResetToken = randomBytes(5).toString("hex");

    const oneHourInUnixTimestamp = new Date(Date.now() + 60 * 60 * 1000);

    try {
      await this.mailAdapter.sendMail({
        from: "sender@server.com",
        to: email,
        subject: "Reset Password",
        text: `Your password recovery code is: ${passwordResetToken}, please return to the password reset screen, and enter the password recovery code to proceed, the code will expire in 1 hour.`,
        html: [
          `<div style="font-family: sans-serif; font-size: 16px; color: #111">`,
          `<p>Your password recovery code is: ${passwordResetToken}, please return to the password reset screen, and enter the password recovery code to proceed, the code will expire in 1 hour.</p>`,
          `</div>`,
        ].join("\n"),
      });

      userFound.password_reset_token = passwordResetToken;
      userFound.password_reset_token_expiration = oneHourInUnixTimestamp;

      this.userRepository.update(userFound);

      return {
        message:
          "A code so you can reset your password has been sent to your email, view your inbox, spam or trash.",
      };
    } catch (error) {
      throw new UnableToSendPasswordRecoveryEmailError();
    }
  }
}
