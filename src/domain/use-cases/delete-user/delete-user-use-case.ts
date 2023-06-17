import { type UserRepository } from "@domain/repositories/user-repository";

import { UserNotFoundError } from "../errors/user-not-found-error";

interface DeleteUserRequest {
  id: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: DeleteUserRequest): Promise<null> {
    const user = await this.userRepository.findById(id);

    if (user === null) throw new UserNotFoundError();

    await this.userRepository.delete(user.id);

    return null;
  }
}
