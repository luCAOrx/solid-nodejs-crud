import { type User } from "@domain/entities/user/user";
import { type UserRepository } from "@domain/repositories/user-repository";

import { type BaseUseCase } from "../base-use-case";
import { GlobalUseCaseErrors } from "../global-errors/global-use-case-errors";

interface GetUserRequest {
  id: string;
}

interface GetUserResponse {
  user: User;
}

export class GetUserUseCase
  implements BaseUseCase<GetUserRequest, GetUserResponse>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: GetUserRequest): Promise<GetUserResponse> {
    const userOrNull = await this.userRepository.findById(id);

    if (userOrNull === null) throw new GlobalUseCaseErrors.UserNotFoundError();

    userOrNull.read_time = userOrNull.read_time += 1;

    await this.userRepository.update(userOrNull);

    return { user: userOrNull };
  }
}
