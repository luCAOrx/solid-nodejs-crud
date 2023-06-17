import { type User } from "@domain/entities/user";
import { type UserRepository } from "@domain/repositories/user-repository";

import { UserNotFoundError } from "./errors/user-not-found-error";

interface GetUserRequest {
  id: string;
}

interface GetUserResponse {
  user: User;
}

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: GetUserRequest): Promise<GetUserResponse> {
    const user = await this.userRepository.findById(id);

    if (user === null) throw new UserNotFoundError();

    return { user };
  }
}
