import { deepStrictEqual, rejects } from "node:assert";
import { before, describe, it } from "node:test";

import { type User } from "@domain/entities/user/user";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserMailAdapter } from "@test/utils/user-mail-adapter";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { UnableToSendPasswordRecoveryEmailError } from "./errors/unable-to-send-password-recovery-email-error";
import { ForgotPasswordUseCase } from "./forgot-password-use-case";

describe("Forgot password use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const userMailAdapter = new UserMailAdapter();
  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    inMemoryUserDatabase,
    userMailAdapter
  );

  let user: User;

  before(async () => {
    user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });
  });

  it("should be able send email to recover password", async () => {
    await forgotPasswordUseCase
      .execute({ email: user.props.email })
      .then(({ message }) => {
        deepStrictEqual(
          message,
          "A code so you can reset your password has been sent to your email, view your inbox, spam or trash."
        );
      });
  });

  it("should not be able to send an email to recover the password if the user's email is not found", async () => {
    await rejects(async () => {
      await forgotPasswordUseCase.execute({ email: "fake@email.com" });
    }, UserNotFoundError);
  });

  it("should not be able to send email to recover password if sending email fails to send email", async () => {
    userMailAdapter.sendMail = async () => {
      throw new UnableToSendPasswordRecoveryEmailError();
    };

    await rejects(async () => {
      await forgotPasswordUseCase.execute({ email: user.props.email });
    }, UnableToSendPasswordRecoveryEmailError);
  });
});
