import { type UserRepository } from "@domain/repositories/user-repository";

import { type BaseUseCase } from "../base-use-case";
import { GlobalUseCaseErrors } from "../global-errors/global-use-case-errors";

interface DeleteUserRequest {
  id: string;
}

export class DeleteUserUseCase implements BaseUseCase<DeleteUserRequest, void> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: DeleteUserRequest): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (user === null) throw new GlobalUseCaseErrors.UserNotFoundError();

    await this.userRepository.delete(user.id);
  }
}
