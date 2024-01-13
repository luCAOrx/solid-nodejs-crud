import { type UserRepository } from "@domain/repositories/user-repository";

import { BaseUseCase } from "../base-use-case";
import { UserNotFoundError } from "../errors/user-not-found-error";

interface DeleteUserRequest {
  id: string;
}

export class DeleteUserUseCase extends BaseUseCase<DeleteUserRequest, void> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  protected async execute({ id }: DeleteUserRequest): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (user === null) throw new UserNotFoundError();

    await this.userRepository.delete(user.id);
  }
}
