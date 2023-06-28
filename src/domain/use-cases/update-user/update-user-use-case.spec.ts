import { User } from "@domain/entities/user";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { UserAlreadyExistsError } from "../register-user/errors/user-already-exists-error";
import { UpdateUserUseCase } from "./update-user-use-case";

describe("Update user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const updateUserUseCase = new UpdateUserUseCase(inMemoryUserDatabase);

  it("should be able update user", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const { updatedUser } = await updateUserUseCase.execute({
      id: user.id,
      user: {
        ...user.props,
        email: "eike@example.com",
        job: "Driver",
      },
    });

    expect(inMemoryUserDatabase.users[0].id).toStrictEqual(updatedUser.id);
    expect(inMemoryUserDatabase.users[0].props.job).toStrictEqual("driver");
    expect(inMemoryUserDatabase.users[0]).toStrictEqual(updatedUser);
    expect(inMemoryUserDatabase.users).toHaveLength(1);
    expect(updatedUser).toBeTruthy();
    expect(updatedUser).toStrictEqual(updatedUser);
    expect(updatedUser).toBeInstanceOf(User);
  });

  it("should not be able update user that non exists", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    await expect(async () => {
      await updateUserUseCase.execute({
        id: "1234567890000000",
        user: {
          ...user.props,
          job: "Singer",
        },
      });
    }).rejects.toThrowError(UserNotFoundError);
  });

  it("should not be able update user with invalid data", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
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

  it("should not be able update user with existing email", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    await expect(async () => {
      await updateUserUseCase.execute({
        id,
        user: {
          name: "Joe Blank",
          job: "Doctor",
          email: "joe@example.com",
          password: "1234567890",
        },
      });
    }).rejects.toThrowError(UserAlreadyExistsError);
  });
});
