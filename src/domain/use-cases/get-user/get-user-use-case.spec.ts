import { deepStrictEqual, ok, rejects } from "node:assert";
import { describe, it, before } from "node:test";

import { User } from "@domain/entities/user/user";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { GetUserUseCase } from "./get-user-use-case";

describe("Get user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const getUserUseCase = new GetUserUseCase(inMemoryUserDatabase);

  let user: User;

  before(async () => {
    user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });
  });

  it("should be able get user", async () => {
    await getUserUseCase.execute({ id: user.id }).then((response) => {
      deepStrictEqual(inMemoryUserDatabase.users[0].id, response.user.id);
      deepStrictEqual(inMemoryUserDatabase.users[0].read_time, 1);
      deepStrictEqual(inMemoryUserDatabase.users[0], response.user);
      deepStrictEqual(inMemoryUserDatabase.users.length, 1);
      ok(response.user);
      deepStrictEqual(response.user, user);
      ok(response.user instanceof User);
    });
  });

  it("should be able to count how many times the user has been read", async () => {
    await getUserUseCase
      .execute({
        id: user.id,
      })
      .then((response) => {
        deepStrictEqual(inMemoryUserDatabase.users[0].id, response.user.id);
        deepStrictEqual(inMemoryUserDatabase.users[0].read_time, 2);
        deepStrictEqual(inMemoryUserDatabase.users[0], response.user);
        deepStrictEqual(inMemoryUserDatabase.users.length, 1);
        ok(response.user);
        ok(response.user instanceof User);
      });

    await getUserUseCase
      .execute({
        id: user.id,
      })
      .then((response) => {
        deepStrictEqual(inMemoryUserDatabase.users[0].id, response.user.id);
        deepStrictEqual(inMemoryUserDatabase.users[0].read_time, 3);
        deepStrictEqual(inMemoryUserDatabase.users[0], response.user);
        deepStrictEqual(inMemoryUserDatabase.users.length, 1);
        ok(response.user);
        ok(response.user instanceof User);
      });

    await getUserUseCase
      .execute({
        id: user.id,
      })
      .then((response) => {
        deepStrictEqual(inMemoryUserDatabase.users[0].id, response.user.id);
        deepStrictEqual(inMemoryUserDatabase.users[0].read_time, 4);
        deepStrictEqual(inMemoryUserDatabase.users[0], response.user);
        deepStrictEqual(inMemoryUserDatabase.users.length, 1);
        ok(response.user);
        ok(response.user instanceof User);
      });
  });

  it("should not be able get user if user not exists", async () => {
    await rejects(
      async () => await getUserUseCase.execute({ id: "1234567890" }),
      UserNotFoundError
    );
  });
});
