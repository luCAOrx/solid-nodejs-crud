import { strictEqual, ok, rejects } from "node:assert";
import { describe, it, before } from "node:test";

import { type User } from "@domain/entities/user/user";
import { MakeAdminUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { RegisterUserUseCase } from "../register-user/register-user-use-case";
import { AccessDeniedError } from "./errors/access-denied-error";
import { GetUsersUseCase } from "./get-users-use-case";

describe("Get users use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const registerUserUseCase = new RegisterUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider
  );

  const getUsersUseCase = new GetUsersUseCase(inMemoryUserDatabase);

  const userAdmin = new MakeAdminUserFactory().toDomain({
    inMemoryDatabase: inMemoryUserDatabase,
  });

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

  it("should be able to list users if role is admin", async () => {
    const usersOrUser = await getUsersUseCase.execute({ id: userAdmin.id });

    strictEqual(usersOrUser.length, 5);
    strictEqual(usersOrUser[0].props.email, "david@example.com");
    strictEqual(usersOrUser[1].props.email, "fernando0@example.com");
    ok(usersOrUser instanceof Array<User>);
  });

  it("should not be able to list users if user not found", async () => {
    await rejects(async () => {
      await getUsersUseCase.execute({ id: "1234567890" });
    }, UserNotFoundError);
  });

  it("should not be able to list users if role is common", async () => {
    const userCommon = await registerUserUseCase.execute({
      name: "Gregory Schmidt",
      job: "Soccer Player",
      email: "jimble@example.com",
      password: "1234567890",
    });

    await rejects(async () => {
      await getUsersUseCase.execute({ id: userCommon.user.id });
    }, AccessDeniedError);
  });

  it("should be able paginate", async () => {
    let usersOrUser = await getUsersUseCase.execute({
      id: userAdmin.id,
      takePage: 5,
    });

    strictEqual(usersOrUser.length, 5);
    strictEqual(usersOrUser[0].props.email, "david@example.com");
    strictEqual(usersOrUser[1].props.email, "fernando0@example.com");
    ok(usersOrUser instanceof Array<User>);

    usersOrUser = await getUsersUseCase.execute({
      id: userAdmin.id,
      page: 2,
      takePage: 5,
    });

    strictEqual(usersOrUser.length, 5);
    strictEqual(usersOrUser[0].props.email, "fernando4@example.com");
    strictEqual(usersOrUser[1].props.email, "fernando5@example.com");
    ok(usersOrUser instanceof Array<User>);
  });
});
