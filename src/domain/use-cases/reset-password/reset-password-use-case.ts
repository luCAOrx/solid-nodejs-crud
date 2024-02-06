import { Password } from "@domain/entities/password/password";
import { type SecurityProvider } from "@domain/providers/security-provider";
import { type UserRepository } from "@domain/repositories/user-repository";

import { type BaseUseCase } from "../base-use-case";
import { GlobalUseCaseErrors } from "../global-errors/global-use-case-errors";
import { ResetPasswordUseCaseErrors } from "./errors/reset-password-use-case-errors";

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export class ResetPasswordUseCase
  implements BaseUseCase<ResetPasswordRequest, ResetPasswordResponse>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSecurityProvider: SecurityProvider
  ) {}

  async execute({
    code,
    confirmPassword,
    email,
    newPassword,
  }: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const userFound = await this.userRepository.findByEmail(email);

    if (userFound === null) throw new GlobalUseCaseErrors.UserNotFoundError();

    if (code !== userFound.password_reset_token)
      throw new ResetPasswordUseCaseErrors.InvalidCodeToResetPasswordError();
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
      throw new ResetPasswordUseCaseErrors.PasswordResetTokenHasExpiredError();

    const passwordOrError = Password.create(newPassword);

    if (passwordOrError.value !== confirmPassword)
      throw new ResetPasswordUseCaseErrors.PasswordsDoNotMatchError();

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
