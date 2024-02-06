import { type User } from "@domain/entities/user/user";
import { type UserRepository } from "@domain/repositories/user-repository";

import { type BaseUseCase } from "../base-use-case";
import { GlobalUseCaseErrors } from "../global-errors/global-use-case-errors";
import { GetUsersUseCaseErrors } from "./errors/get-users-use-case-errors";

interface GetUsersRequest {
  id: string;
  page?: number;
  takePage?: number;
}

export class GetUsersUseCase implements BaseUseCase<GetUsersRequest, User[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    id,
    page = 1,
    takePage = 5,
  }: GetUsersRequest): Promise<User[]> {
    const user = await this.userRepository.findById(id);

    if (user === null) throw new GlobalUseCaseErrors.UserNotFoundError();

    if (user.props.role !== "ADMIN")
      throw new GetUsersUseCaseErrors.AccessDeniedError();

    const usersOrUser = await this.userRepository.findMany(page, takePage);

    return usersOrUser;
  }
}
