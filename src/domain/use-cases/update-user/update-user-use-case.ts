import { Email } from "@domain/entities/email/email";
import { Job } from "@domain/entities/job/job";
import { Name } from "@domain/entities/name/name";
import { Password } from "@domain/entities/password/password";
import { User } from "@domain/entities/user/user";
import { type SecurityProvider } from "@domain/providers/security-provider";
import { type UserRepository } from "@domain/repositories/user-repository";

import { type BaseUseCase } from "../base-use-case";
import { GlobalUseCaseErrors } from "../global-errors/global-use-case-errors";
import { UpdateUserUseCaseErrors } from "./erros/update-user-use-case-errors";

interface UpdateUserRequest {
  id: string;
  data: {
    name: string;
    job: string;
    email: string;
    currentPassword: string;
    newPassword: string;
  };
}

interface UpdateUserResponse {
  updatedUser: User;
}

export class UpdateUserUseCase
  implements BaseUseCase<UpdateUserRequest, UpdateUserResponse>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSecurityProvider: SecurityProvider
  ) {}

  async execute({
    id,
    data: { name, job, email, currentPassword, newPassword },
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const userFound = await this.userRepository.findById(id);
    const userAlreadyExists = await this.userRepository.exists(email);

    if (userFound === null) throw new GlobalUseCaseErrors.UserNotFoundError();

    if (email !== userFound.props.email && userAlreadyExists)
      throw new GlobalUseCaseErrors.UserAlreadyExistsError();

    const isPasswordSameSaveInDatabase =
      await this.userSecurityProvider.compare({
        password: currentPassword,
        hashedPassword: userFound.props.password,
      });

    if (!isPasswordSameSaveInDatabase)
      throw new UpdateUserUseCaseErrors.TheCurrentPasswordIsInvalidError();

    const nameOrError = Name.create(name);
    const jobOrError = Job.create(job);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(newPassword);

    const hashedPassword = await this.userSecurityProvider.hash({
      password: passwordOrError.value,
      salt: 14,
    });

    const user = User.create(
      {
        name: nameOrError.value,
        job: jobOrError.value,
        email: emailOrError.value,
        password: hashedPassword,
        role: userFound.props.role,
      },
      userFound.id,
      userFound.read_time,
      userFound.password_reset_token,
      userFound.password_reset_token_expiration,
      new Date()
    );

    userFound.props = user.props;
    userFound.updated_at = user.updated_at;

    await this.userRepository.update(userFound);

    return { updatedUser: userFound };
  }
}
