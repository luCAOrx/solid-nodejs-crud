import { type User } from "@domain/entities/user";
import { type UserRepository } from "@domain/repositories/user-repository";

import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: User;
}

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const userOrNull = await this.userRepository.findByEmail(email);

    if (userOrNull === null) throw new InvalidEmailOrPasswordError();

    if (password !== userOrNull.props.password)
      throw new InvalidEmailOrPasswordError();

    return { user: userOrNull };
  }
}
