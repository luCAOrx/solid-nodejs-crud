import { User } from "@domain/entities/user";
import { type UserRepository } from "@domain/repositories/user-repository";

import { UserNotFoundError } from "../errors/user-not-found-error";

interface GetUserRequest {
  id: string;
}

interface GetUserResponse {
  user: User;
}

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: GetUserRequest): Promise<GetUserResponse> {
    const userOrNull = await this.userRepository.findById(id);

    if (userOrNull === null) throw new UserNotFoundError();

    const userWithUpdatedReadTime = User.create(
      {
        name: userOrNull.props.name,
        job: userOrNull.props.job,
        email: userOrNull.props.email,
        password: userOrNull.props.password,
      },
      userOrNull.id,
      userOrNull.read_time++,
      userOrNull.updated_at
    );

    userOrNull.props = userWithUpdatedReadTime.props;

    const user = await this.userRepository.update(userOrNull);

    return { user };
  }
}
