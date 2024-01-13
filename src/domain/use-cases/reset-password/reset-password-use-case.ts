import { Password } from "@domain/entities/password/password";
import { type SecurityProvider } from "@domain/providers/security-provider";
import { type UserRepository } from "@domain/repositories/user-repository";

import { BaseUseCase } from "../base-use-case";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { InvalidCodeToResetPasswordError } from "./errors/invalid-code-to-reset-password-error";
import { PasswordResetTokenHasExpiredError } from "./errors/password-reset-token-has-expired-error";
import { PasswordsDoNotMatchError } from "./errors/passwords-do-not-match-error";

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export class ResetPasswordUseCase extends BaseUseCase<
  ResetPasswordRequest,
  ResetPasswordResponse
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSecurityProvider: SecurityProvider
  ) {
    super();
  }

  protected async execute({
    code,
    confirmPassword,
    email,
    newPassword,
  }: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const userFound = await this.userRepository.findByEmail(email);

    if (userFound === null) throw new UserNotFoundError();

    if (code !== userFound.password_reset_token)
      throw new InvalidCodeToResetPasswordError();

    const currentDate = new Date();

    function removeMinutesAndMilliseconds(date: Date): Date {
      date.setMinutes(0, 0, 0);

      return date;
    }

    const currentDateWithoutMinutesAndMilliseconds =
      removeMinutesAndMilliseconds(currentDate);

    const passwordResetTokenExpirationWithoutMinutesAndMilliseconds =
      removeMinutesAndMilliseconds(userFound.password_reset_token_expiration);

    const passwordResetTokenHasExpired =
      currentDateWithoutMinutesAndMilliseconds >
      passwordResetTokenExpirationWithoutMinutesAndMilliseconds;

    if (passwordResetTokenHasExpired)
      throw new PasswordResetTokenHasExpiredError();

    const passwordOrError = Password.create(newPassword);

    if (passwordOrError.value !== confirmPassword)
      throw new PasswordsDoNotMatchError();

    const hashedPassword = await this.userSecurityProvider.hash({
      password: passwordOrError.value,
      salt: 14,
    });

    userFound.props.password = hashedPassword;
    userFound.updated_at = currentDate;

    await this.userRepository.update(userFound);

    return { message: "Password recovered successfully" };
  }
}
