import { Email } from "@domain/entities/email/email";
import { Job } from "@domain/entities/job/job";
import { Name } from "@domain/entities/name/name";
import { Password } from "@domain/entities/password/password";
import { User } from "@domain/entities/user/user";
import { type InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { BASE_URL } from "@test/utils/base-url";

import { MakeRequestFactory } from "./make-request-factory";

interface UserProps {
  name: string;
  job: string;
  email: string;
  password: string;
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
    const nameOrError = Name.create("Joe Smith");
    const jobOrError = Job.create("Development");
    const emailOrError = Email.create("joe@example.com");
    const passwordOrError = Password.create("1234567890");

    const user = User.create({
      name: nameOrError.value,
      job: jobOrError.value,
      email: emailOrError.value,
      password: passwordOrError.value,
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
