import { strictEqual, ok, rejects } from "node:assert";
import { describe, it } from "node:test";

import { User } from "@domain/entities/user/user";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { GetUserUseCase } from "./get-user-use-case";

describe("Get user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const getUserUseCase = new GetUserUseCase(inMemoryUserDatabase);

  it("should be able get user", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const { user } = await getUserUseCase.execute({ id });

    strictEqual(inMemoryUserDatabase.users[0].id, user.id);
    strictEqual(inMemoryUserDatabase.users[0].read_time, 1);
    strictEqual(inMemoryUserDatabase.users[0], user);
    strictEqual(inMemoryUserDatabase.users.length, 1);
    ok(user);
    strictEqual(user, user);
    ok(user instanceof User);
  });

  it("should be able to count how many times the user has been read", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: { name: "Stan March", email: "stan@example.com" },
    });

    const { user: userReadOneTimes } = await getUserUseCase.execute({ id });

    strictEqual(inMemoryUserDatabase.users[1].id, userReadOneTimes.id);
    strictEqual(inMemoryUserDatabase.users[1].read_time, 1);
    strictEqual(inMemoryUserDatabase.users[1], userReadOneTimes);
    strictEqual(inMemoryUserDatabase.users.length, 2);
    ok(userReadOneTimes);
    strictEqual(userReadOneTimes, userReadOneTimes);
    ok(userReadOneTimes instanceof User);

    const { user: userReadTwoTimes } = await getUserUseCase.execute({ id });

    strictEqual(inMemoryUserDatabase.users[1].id, userReadTwoTimes.id);
    strictEqual(inMemoryUserDatabase.users[1].read_time, 2);
    strictEqual(inMemoryUserDatabase.users[1], userReadTwoTimes);
    strictEqual(inMemoryUserDatabase.users.length, 2);
    ok(userReadTwoTimes);
    strictEqual(userReadTwoTimes, userReadTwoTimes);
    ok(userReadTwoTimes instanceof User);

    const { user: userReadThreeTimes } = await getUserUseCase.execute({ id });

    strictEqual(inMemoryUserDatabase.users[1].id, userReadThreeTimes.id);
    strictEqual(inMemoryUserDatabase.users[1].read_time, 3);
    strictEqual(inMemoryUserDatabase.users[1], userReadThreeTimes);
    strictEqual(inMemoryUserDatabase.users.length, 2);
    ok(userReadThreeTimes);
    strictEqual(userReadThreeTimes, userReadThreeTimes);
    ok(userReadThreeTimes instanceof User);
  });

  it("should not be able get user if user not exists", async () => {
    await rejects(
      async () => await getUserUseCase.execute({ id: "1234567890" }),
      UserNotFoundError
    );
  });
});
