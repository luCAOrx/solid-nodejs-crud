import {type User} from "@domain/entities/user/user";
import {type UserRepository} from "@domain/repositories/user-repository";

import {BaseUseCase} from "../base-use-case";
import {UserNotFoundError} from "../errors/user-not-found-error";
import {AccessDeniedError} from "./errors/access-denied-error";

interface GetUsersRequest {
  id: string;
  page?: number;
  takePage?: number;
}

export class GetUsersUseCase extends BaseUseCase<GetUsersRequest, User[]> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  protected async execute({
    id,
    page = 1,
    takePage = 5,
  }: GetUsersRequest): Promise<User[]> {
    const user = await this.userRepository.findById(id);

    if (user === null) throw new UserNotFoundError();

    if (user.props.role !== "ADMIN") throw new AccessDeniedError();

    const usersOrUser = await this.userRepository.findMany(page, takePage);

    return usersOrUser;
  }
}
