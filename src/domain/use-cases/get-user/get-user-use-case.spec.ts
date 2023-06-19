import { User } from "@domain/entities/user";
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

    expect(inMemoryUserDatabase.users[0].id).toStrictEqual(user.id);
    expect(inMemoryUserDatabase.users[0].read_time).toStrictEqual(1);
    expect(inMemoryUserDatabase.users[0]).toStrictEqual(user);
    expect(inMemoryUserDatabase.users).toHaveLength(1);
    expect(user).toBeTruthy();
    expect(user).toStrictEqual(user);
    expect(user).toBeInstanceOf(User);
  });

  it("should be able to count how many times the user has been read", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: { name: "Stan March", email: "stan@example.com" },
    });

    const { user: userReadOneTimes } = await getUserUseCase.execute({ id });

    expect(inMemoryUserDatabase.users[1].id).toStrictEqual(userReadOneTimes.id);
    expect(inMemoryUserDatabase.users[1].read_time).toStrictEqual(1);
    expect(inMemoryUserDatabase.users[1]).toStrictEqual(userReadOneTimes);
    expect(inMemoryUserDatabase.users).toHaveLength(2);
    expect(userReadOneTimes).toBeTruthy();
    expect(userReadOneTimes).toStrictEqual(userReadOneTimes);
    expect(userReadOneTimes).toBeInstanceOf(User);

    const { user: userReadTwoTimes } = await getUserUseCase.execute({ id });

    expect(inMemoryUserDatabase.users[1].id).toStrictEqual(userReadTwoTimes.id);
    expect(inMemoryUserDatabase.users[1].read_time).toStrictEqual(2);
    expect(inMemoryUserDatabase.users[1]).toStrictEqual(userReadTwoTimes);
    expect(inMemoryUserDatabase.users).toHaveLength(2);
    expect(userReadTwoTimes).toBeTruthy();
    expect(userReadTwoTimes).toStrictEqual(userReadTwoTimes);
    expect(userReadTwoTimes).toBeInstanceOf(User);

    const { user: userReadThreeTimes } = await getUserUseCase.execute({ id });

    expect(inMemoryUserDatabase.users[1].id).toStrictEqual(
      userReadThreeTimes.id
    );
    expect(inMemoryUserDatabase.users[1].read_time).toStrictEqual(3);
    expect(inMemoryUserDatabase.users[1]).toStrictEqual(userReadThreeTimes);
    expect(inMemoryUserDatabase.users).toHaveLength(2);
    expect(userReadThreeTimes).toBeTruthy();
    expect(userReadThreeTimes).toStrictEqual(userReadThreeTimes);
    expect(userReadThreeTimes).toBeInstanceOf(User);
  });

  it("should not be able get user if user not exists", async () => {
    await expect(async () => {
      await getUserUseCase.execute({ id: "1234567890" });
    }).rejects.toThrowError(UserNotFoundError);
  });
});
