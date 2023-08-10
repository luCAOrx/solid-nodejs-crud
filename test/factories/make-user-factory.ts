import { type Role, type User } from "@domain/entities/user/user";
import { RegisterUserUseCase } from "@domain/use-cases/register-user/register-user-use-case";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { BASE_URL } from "@test/utils/base-url";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { MakeRequestFactory } from "./make-request-factory";

interface UserProps {
  name: string;
  job: string;
  email: string;
  password: string;
  role: Role;
}

type Override = Partial<UserProps>;

export class MakeUserFactory {
  public async toDomain({
    inMemoryDatabase,
    override,
  }: {
    inMemoryDatabase: InMemoryUserDatabase;
    override?: Override;
  }): Promise<User> {
    const inMemoryUserDatabase = new InMemoryUserDatabase();
    const userSecurityProvider = new UserSecurityProvider();
    const registerUserUseCase = new RegisterUserUseCase(
      inMemoryUserDatabase,
      userSecurityProvider
    );

    const { user } = await registerUserUseCase.execute({
      name: "Joe Smith",
      job: "Development",
      email: "joe@example.com",
      password: "1234567890",
      ...override,
    });

    await inMemoryDatabase.create(user);

    return user;
  }

  public async toHttp({
    override,
  }: {
    override?: Override;
  }): Promise<Response> {
    return await MakeRequestFactory.execute({
      url: `${BASE_URL}/users/register`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: "John Doe",
        job: "Doctor",
        email: "johndoe@example.com",
        password: "1234567890",
        ...override,
      },
    });
  }
}
