import { Email } from "@domain/entities/email/email";
import { Job } from "@domain/entities/job/job";
import { Name } from "@domain/entities/name/name";
import { Password } from "@domain/entities/password/password";
import { User } from "@domain/entities/user/user";
import { type SecurityProvider } from "@domain/providers/security-provider";
import { type UserRepository } from "@domain/repositories/user-repository";

import { type BaseUseCase } from "../base-use-case";
import { GlobalUseCaseErrors } from "../global-errors/global-use-case-errors";

interface RegisterUserRequest {
  name: string;
  job: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  user: User;
}

export class RegisterUserUseCase
  implements BaseUseCase<RegisterUserRequest, RegisterUserResponse>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSecurityProvider: SecurityProvider
  ) {}

  async execute({
    name,
    email,
    job,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const nameOrError = Name.create(name);
    const jobOrError = Job.create(job);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);

    const hashedPassword = await this.userSecurityProvider.hash({
      password: passwordOrError.value,
      salt: 14,
    });

    const user = User.create({
      name: nameOrError.value,
      job: jobOrError.value,
      email: emailOrError.value,
      password: hashedPassword,
      role: "COMMON",
    });

    const userAlreadyExists = await this.userRepository.exists(
      user.props.email
    );

    if (userAlreadyExists)
      throw new GlobalUseCaseErrors.UserAlreadyExistsError();

    await this.userRepository.create(user);

    return { user };
  }
}
