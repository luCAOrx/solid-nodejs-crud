import { strictEqual, rejects, ok } from "node:assert";
import { describe, it } from "node:test";

import { User } from "@domain/entities/user/user";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { UserAlreadyExistsError } from "../register-user/errors/user-already-exists-error";
import { UpdateUserUseCase } from "./update-user-use-case";

describe("Update user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const updateUserUseCase = new UpdateUserUseCase(inMemoryUserDatabase);

  it("should be able update all data from user", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: {
        email: "update-all-data-test@example.com",
      },
    });

    const { updatedUser } = await updateUserUseCase.execute({
      id: user.id,
      data: {
        name: "Kevin Houston",
        job: "Driver",
        email: "kevin@example.com",
        password: "12345678901234567890",
      },
    });

    strictEqual(inMemoryUserDatabase.users[0].id, updatedUser.id);
    strictEqual(inMemoryUserDatabase.users[0], updatedUser);
    strictEqual(inMemoryUserDatabase.users.length, 1);
    ok(updatedUser);
    strictEqual(updatedUser, updatedUser);
    ok(updatedUser instanceof User);
  });

  it("should be able update just name from user", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: {
        email: "update-name-test@example.com",
      },
    });

    const { updatedUser } = await updateUserUseCase.execute({
      id: user.id,
      data: {
        ...user.props,
        name: "James Flinch",
      },
    });

    strictEqual(inMemoryUserDatabase.users[1].id, updatedUser.id);
    strictEqual(inMemoryUserDatabase.users[1].props.name, "James Flinch");
    strictEqual(inMemoryUserDatabase.users[1], updatedUser);
    strictEqual(inMemoryUserDatabase.users.length, 2);
    ok(updatedUser);
    strictEqual(updatedUser, updatedUser);
    ok(updatedUser instanceof User);
  });

  it("should be able update just job from user", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: {
        email: "update-job-test@example.com",
      },
    });

    const { updatedUser } = await updateUserUseCase.execute({
      id: user.id,
      data: {
        ...user.props,
        job: "Driver",
      },
    });

    strictEqual(inMemoryUserDatabase.users[2].id, updatedUser.id);
    strictEqual(inMemoryUserDatabase.users[2].props.job, "driver");
    strictEqual(inMemoryUserDatabase.users[2], updatedUser);
    strictEqual(inMemoryUserDatabase.users.length, 3);
    ok(updatedUser);
    strictEqual(updatedUser, updatedUser);
    ok(updatedUser instanceof User);
  });

  it("should be able update just email from user", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: {
        email: "update-email-test@example.com",
      },
    });

    const { updatedUser } = await updateUserUseCase.execute({
      id: user.id,
      data: {
        ...user.props,
        email: "updated-email@example.com",
      },
    });

    strictEqual(inMemoryUserDatabase.users[3].id, updatedUser.id);
    strictEqual(
      inMemoryUserDatabase.users[3].props.email,
      "updated-email@example.com"
    );
    strictEqual(inMemoryUserDatabase.users[3], updatedUser);
    strictEqual(inMemoryUserDatabase.users.length, 4);
    ok(updatedUser);
    strictEqual(updatedUser, updatedUser);
    ok(updatedUser instanceof User);
  });

  it("should be able update just password from user", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: {
        email: "update-password-test@example.com",
      },
    });

    const { updatedUser } = await updateUserUseCase.execute({
      id: user.id,
      data: {
        ...user.props,
        password: "updated-password",
      },
    });

    strictEqual(inMemoryUserDatabase.users[4].id, updatedUser.id);
    strictEqual(
      inMemoryUserDatabase.users[4].props.password,
      "updated-password"
    );
    strictEqual(inMemoryUserDatabase.users[4], updatedUser);
    strictEqual(inMemoryUserDatabase.users.length, 5);
    ok(updatedUser);
    strictEqual(updatedUser, updatedUser);
    ok(updatedUser instanceof User);
  });

  it("should not be able update user that non exists", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    await rejects(async () => {
      await updateUserUseCase.execute({
        id: "1234567890000000",
        data: {
          ...user.props,
        },
      });
    }, UserNotFoundError);
  });

  it("should not be able update user with invalid data", async () => {
    const { id } = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    await rejects(async () => {
      await updateUserUseCase.execute({
        id,
        data: {
          name: "",
          job: "Cop".repeat(260),
          email: "@example.com",
          password: "123",
        },
      });
    }, NameShouldNotBeEmptyError);
  });

  it("should not be able update user with existing email", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    await rejects(async () => {
      await updateUserUseCase.execute({
        id: user.id,
        data: {
          ...user.props,
          email: "kevin@example.com",
        },
      });
    }, UserAlreadyExistsError);
  });
});
