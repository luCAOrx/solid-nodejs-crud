import { type User } from "@domain/entities/user/user";
import { type UserRepository } from "@domain/repositories/user-repository";

interface GetUsersRequest {
  page?: number;
  takePage?: number;
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ page = 1, takePage = 5 }: GetUsersRequest): Promise<User[]> {
    const usersOrUser = await this.userRepository.findMany(page, takePage);

    return usersOrUser;
  }
}
