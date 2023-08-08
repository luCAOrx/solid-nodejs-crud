import { type User } from "@domain/entities/user/user";
import { type SecurityProvider } from "@domain/providers/security-provider";
import { type UserRepository } from "@domain/repositories/user-repository";

import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: User;
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityProvider: SecurityProvider
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const userOrNull = await this.userRepository.findByEmail(email);

    const isPasswordSameSaveInDatabase = await this.securityProvider.compare({
      password,
      hash: String(userOrNull?.props.password),
    });

    if (userOrNull === null || !isPasswordSameSaveInDatabase)
      throw new InvalidEmailOrPasswordError();

    const token = this.securityProvider.sign({
      payload: { id: userOrNull.id },
      secretOrPrivateKey: String(process.env.JWT_SECRET),
      expiresIn: "20s",
    });

    return { user: userOrNull, token };
  }
}
