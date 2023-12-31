import { deepStrictEqual, ok, rejects } from "node:assert";
import { describe, it, before } from "node:test";

import { type User } from "@domain/entities/user/user";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserMailAdapter } from "@test/utils/user-mail-adapter";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { ForgotPasswordUseCase } from "../forgot-password/forgot-password-use-case";
import { InvalidCodeToResetPasswordError } from "./errors/invalid-code-to-reset-password-error";
import { PasswordResetTokenHasExpiredError } from "./errors/password-reset-token-has-expired-error";
import { PasswordsDoNotMatchError } from "./errors/passwords-do-not-match-error";
import { ResetPasswordUseCase } from "./reset-password-use-case";

describe("Reset password use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const userMailAdapter = new UserMailAdapter();
  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    inMemoryUserDatabase,
    userMailAdapter
  );
  const resetPasswordUseCase = new ResetPasswordUseCase(
    inMemoryUserDatabase,
    userSecurityProvider
  );

  let user: User;

  before(async () => {
    user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    await forgotPasswordUseCase.execute({ email: user.props.email });

    await inMemoryUserDatabase
      .findByEmail(user.props.email)
      .then((response) => {
        if (response !== null) user = response;
      });
  });

  it("should be able reset password", async () => {
    await resetPasswordUseCase
      .execute({
        email: user.props.email,
        code: user.password_reset_token,
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      })
      .then(({ message }) => {
        deepStrictEqual(message, "Password recovered successfully");
      });

    await inMemoryUserDatabase
      .findByEmail(user.props.email)
      .then(async (response) => {
        if (response !== null) {
          const comparedPassword = await userSecurityProvider.compare({
            hashedPassword: response.props.password,
            password: "newPassword123",
          });

          ok(comparedPassword);
        }
      });
  });

  it("should not be able reset password if user not found", async () => {
    await rejects(async () => {
      await resetPasswordUseCase.execute({
        email: "fake-email@example.com",
        code: user.password_reset_token,
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      });
    }, UserNotFoundError);
  });

  it("should not be able reset password if reset password code is invalid", async () => {
    await rejects(async () => {
      await resetPasswordUseCase.execute({
        email: user.props.email,
        code: "invalidResetPasswordCode",
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      });
    }, InvalidCodeToResetPasswordError);
  });

  it("should not be able reset password if reset password token has expired", async () => {
    const delayTimeByOneHour = (): Date => {
      const currentDate = new Date();
      const oneHourBefore = new Date(currentDate.getTime() - 60 * 60 * 1000);

      return oneHourBefore;
    };

    user.password_reset_token_expiration = delayTimeByOneHour();

    await rejects(async () => {
      await resetPasswordUseCase.execute({
        email: user.props.email,
        code: user.password_reset_token,
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      });
    }, PasswordResetTokenHasExpiredError);
  });

  it("should not be able reset password if confirmPassword do not match newPassword", async () => {
    user.password_reset_token_expiration = new Date();

    await rejects(async () => {
      await resetPasswordUseCase.execute({
        email: user.props.email,
        code: user.password_reset_token,
        newPassword: "newPassword123",
        confirmPassword: "newPassword1234",
      });
    }, PasswordsDoNotMatchError);
  });
});
