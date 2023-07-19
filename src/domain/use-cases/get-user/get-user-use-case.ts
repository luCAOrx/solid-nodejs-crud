import { type User } from "@domain/entities/user/user";
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

    userOrNull.read_time = userOrNull.read_time += 1;

    await this.userRepository.update(userOrNull);

    return { user: userOrNull };
  }
}
