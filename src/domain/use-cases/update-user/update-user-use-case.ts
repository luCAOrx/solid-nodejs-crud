import { Email } from "@domain/entities/email/email";
import { Job } from "@domain/entities/job/job";
import { Name } from "@domain/entities/name/name";
import { Password } from "@domain/entities/password/password";
import { User } from "@domain/entities/user/user";
import { type UserRepository } from "@domain/repositories/user-repository";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { UserAlreadyExistsError } from "../register-user/errors/user-already-exists-error";

interface UpdateUserRequest {
  id: string;
  user: {
    name: string;
    job: string;
    email: string;
    password: string;
  };
}

interface UpdateUserResponse {
  updatedUser: User;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    id,
    user: { name, job, email, password },
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const userFound = await this.userRepository.findById(id);

    if (userFound === null) throw new UserNotFoundError();

    const userAlreadyExists = await this.userRepository.exists(email);

    if (userAlreadyExists) throw new UserAlreadyExistsError();

    const nameOrError = Name.create(name);
    const jobOrError = Job.create(job);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);

    const user = User.create(
      {
        name: nameOrError.value,
        job: jobOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
        role: userFound.props.role,
      },
      userFound.id,
      userFound.read_time,
      new Date()
    );

    userFound.props = user.props;

    await this.userRepository.update(userFound);

    return { updatedUser: userFound };
  }
}
