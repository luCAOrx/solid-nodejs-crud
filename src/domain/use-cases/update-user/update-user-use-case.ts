import { Email } from "@domain/entities/email";
import { Job } from "@domain/entities/job";
import { Name } from "@domain/entities/name";
import { Password } from "@domain/entities/password";
import { User } from "@domain/entities/user";
import { type UserRepository } from "@domain/repositories/user-repository";

import { UserNotFoundError } from "../errors/user-not-found-error";

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
      },
      userFound.id,
      userFound.read_time,
      new Date()
    );

    userFound.props = user.props;

    const updatedUser = await this.userRepository.update(userFound);

    return { updatedUser };
  }
}
