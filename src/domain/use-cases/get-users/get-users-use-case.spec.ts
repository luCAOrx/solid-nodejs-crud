import { strictEqual, ok } from "node:assert";
import { describe, it, before } from "node:test";

import { type User } from "@domain/entities/user/user";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { RegisterUserUseCase } from "../register-user/register-user-use-case";
import { GetUsersUseCase } from "./get-users-use-case";

describe("Get users use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const registerUserUseCase = new RegisterUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider
  );

  const getUsersUseCase = new GetUsersUseCase(inMemoryUserDatabase);

  before(async () => {
    for (let i = 0; i < 20; i++) {
      await registerUserUseCase.execute({
        name: "Rafael",
        job: "Actor",
        email: `fernando${i}@example.com`,
        password: "1234567890",
      });
    }
  });

  it("should be able list users", async () => {
    const usersOrUser = await getUsersUseCase.execute({});

    strictEqual(usersOrUser.length, 5);
    strictEqual(usersOrUser[0].props.email, "fernando0@example.com");
    strictEqual(usersOrUser[1].props.email, "fernando1@example.com");
    ok(usersOrUser instanceof Array<User>);
  });

  it("should be able paginate", async () => {
    let usersOrUser = await getUsersUseCase.execute({ takePage: 5 });

    strictEqual(usersOrUser.length, 5);
    strictEqual(usersOrUser[0].props.email, "fernando0@example.com");
    strictEqual(usersOrUser[1].props.email, "fernando1@example.com");
    ok(usersOrUser instanceof Array<User>);

    usersOrUser = await getUsersUseCase.execute({ page: 2, takePage: 5 });

    strictEqual(usersOrUser.length, 5);
    strictEqual(usersOrUser[0].props.email, "fernando5@example.com");
    strictEqual(usersOrUser[1].props.email, "fernando6@example.com");
    ok(usersOrUser instanceof Array<User>);
  });
});
