import { User } from "@domain/entities/user";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { UpdateUserUseCase } from "./update-user-use-case";

describe("Update user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const updateUserUseCase = new UpdateUserUseCase(inMemoryUserDatabase);

  const user = {
    name: "Marcela",
    job: "Seller",
    email: "marcela@example.com",
    password: "12345678900",
  };

  it("should be able update user", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const updatedUser = await updateUserUseCase.execute({
      id,
      user: {
        ...user,
        job: "Seller",
      },
    });

    expect(inMemoryUserDatabase.users[0].props.job).toStrictEqual("seller");
    expect(inMemoryUserDatabase.users[0]).toStrictEqual(updatedUser.user);
    expect(inMemoryUserDatabase.users).toHaveLength(1);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser).toStrictEqual(updatedUser);
    expect(updatedUser.user).toBeInstanceOf(User);
  });

  it("should not be able update user that non exists", async () => {
    await expect(async () => {
      await updateUserUseCase.execute({
        id: "1234567890000000",
        user: {
          ...user,
          job: "Singer",
        },
      });
    }).rejects.toThrowError(UserNotFoundError);
  });

  it("should not be able update user with invalid data", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: { email: "joejoe@example.com" },
    });

    await expect(async () => {
      await updateUserUseCase.execute({
        id,
        user: {
          name: "",
          job: "Cop".repeat(260),
          email: "@example.com",
          password: "123",
        },
      });
    }).rejects.toThrowError(NameShouldNotBeEmptyError);
  });
});
