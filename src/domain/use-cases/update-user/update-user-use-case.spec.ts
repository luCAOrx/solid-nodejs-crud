import { deepStrictEqual, rejects, ok } from "node:assert";
import { describe, it, before } from "node:test";

import { User } from "@domain/entities/user/user";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { UserAlreadyExistsError } from "../register-user/errors/user-already-exists-error";
import { TheCurrentPasswordIsInvalidError } from "./erros/the-current-password-is-invalid-error";
import { UpdateUserUseCase } from "./update-user-use-case";

describe("Update user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const updateUserUseCase = new UpdateUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider
  );

  let user: User;

  before(async () => {
    user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: {
        email: "existing-email@example.com",
      },
    });
  });

  it("should be able update all data from user", async () => {
    await updateUserUseCase
      .execute({
        id: user.id,
        data: {
          name: "Kevin Houston",
          job: "driver",
          email: "kevin@example.com",
          currentPassword: "1234567890",
          newPassword: "updatedPassword",
        },
      })
      .then((response) => {
        deepStrictEqual(
          inMemoryUserDatabase.users[0].id,
          response.updatedUser.id
        );
        deepStrictEqual(inMemoryUserDatabase.users[0], response.updatedUser);
        deepStrictEqual(inMemoryUserDatabase.users.length, 2);
        ok(response.updatedUser instanceof User);

        user = response.updatedUser;
      });
  });

  it("should be able update just name from user", async () => {
    await updateUserUseCase
      .execute({
        id: user.id,
        data: {
          ...user.props,
          name: "James Flinch",
          currentPassword: "updatedPassword",
          newPassword: "updatedPassword",
        },
      })
      .then((response) => {
        deepStrictEqual(
          inMemoryUserDatabase.users[0].id,
          response.updatedUser.id
        );
        deepStrictEqual(
          inMemoryUserDatabase.users[0].props.name,
          "James Flinch"
        );
        deepStrictEqual(inMemoryUserDatabase.users[0], response.updatedUser);
        deepStrictEqual(inMemoryUserDatabase.users.length, 2);
        ok(response.updatedUser instanceof User);

        user = response.updatedUser;
      });
  });

  it("should be able update just job from user", async () => {
    await updateUserUseCase
      .execute({
        id: user.id,
        data: {
          ...user.props,
          job: "driver",
          currentPassword: "updatedPassword",
          newPassword: "updatedPassword",
        },
      })
      .then((response) => {
        deepStrictEqual(
          inMemoryUserDatabase.users[0].id,
          response.updatedUser.id
        );
        deepStrictEqual(inMemoryUserDatabase.users[0].props.job, "driver");
        deepStrictEqual(inMemoryUserDatabase.users[0], response.updatedUser);
        deepStrictEqual(inMemoryUserDatabase.users.length, 2);
        ok(response.updatedUser instanceof User);

        user = response.updatedUser;
      });
  });

  it("should be able update just email from user", async () => {
    await updateUserUseCase
      .execute({
        id: user.id,
        data: {
          ...user.props,
          email: "updated-email@example.com",
          currentPassword: "updatedPassword",
          newPassword: "updatedPassword",
        },
      })
      .then((response) => {
        deepStrictEqual(
          inMemoryUserDatabase.users[0].id,
          response.updatedUser.id
        );
        deepStrictEqual(
          inMemoryUserDatabase.users[0].props.email,
          "updated-email@example.com"
        );
        deepStrictEqual(inMemoryUserDatabase.users[0], response.updatedUser);
        deepStrictEqual(inMemoryUserDatabase.users.length, 2);
        ok(response.updatedUser instanceof User);

        user = response.updatedUser;
      });
  });

  it("should be able update just newPassword from user", async () => {
    await updateUserUseCase
      .execute({
        id: user.id,
        data: {
          ...user.props,
          currentPassword: "updatedPassword",
          newPassword: "updatedPassword",
        },
      })
      .then((response) => {
        deepStrictEqual(
          inMemoryUserDatabase.users[0].id,
          response.updatedUser.id
        );
        deepStrictEqual(
          inMemoryUserDatabase.users[0].props.password,
          response.updatedUser.props.password
        );
        deepStrictEqual(inMemoryUserDatabase.users[0], response.updatedUser);
        deepStrictEqual(inMemoryUserDatabase.users.length, 2);
        ok(response.updatedUser instanceof User);

        user = response.updatedUser;
      });
  });

  it("should not be able update user that non exists", async () => {
    await rejects(async () => {
      await updateUserUseCase.execute({
        id: "1234567890000000",
        data: {
          ...user.props,
          currentPassword: "updatedPassword",
          newPassword: "updatedPassword",
        },
      });
    }, UserNotFoundError);
  });

  it("should not be able update user with invalid data", async () => {
    await rejects(async () => {
      await updateUserUseCase.execute({
        id: user.id,
        data: {
          name: "",
          job: "Cop".repeat(260),
          email: "@example.com",
          currentPassword: "updatedPassword",
          newPassword: "updatedPassword",
        },
      });
    }, NameShouldNotBeEmptyError);
  });

  it("should not be able update user with existing email", async () => {
    await rejects(async () => {
      await updateUserUseCase.execute({
        id: user.id,
        data: {
          ...user.props,
          email: "existing-email@example.com",
          currentPassword: "updatedPassword",
          newPassword: "updatedPassword",
        },
      });
    }, UserAlreadyExistsError);
  });

  it("should not be able update user if current password is invalid", async () => {
    await rejects(async () => {
      await updateUserUseCase.execute({
        id: user.id,
        data: {
          ...user.props,
          currentPassword: "fakeUpdatedPassword",
          newPassword: "updatedPassword",
        },
      });
    }, TheCurrentPasswordIsInvalidError);
  });
});
