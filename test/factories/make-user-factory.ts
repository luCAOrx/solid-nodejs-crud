import { Email } from "@domain/entities/email";
import { Job } from "@domain/entities/job";
import { Name } from "@domain/entities/name";
import { Password } from "@domain/entities/password";
import { User } from "@domain/entities/user";
import { type InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

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
}
