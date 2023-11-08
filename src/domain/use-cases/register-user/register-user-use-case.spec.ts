import { deepStrictEqual, ok, rejects } from "node:assert";
import { describe, it } from "node:test";

import { User } from "@domain/entities/user/user";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUserUseCase } from "./register-user-use-case";

describe("Register user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const registerUserUseCase = new RegisterUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider
  );

  it("should be able to register new user", async () => {
    await new MakeUserFactory()
      .toDomain({
        inMemoryDatabase: inMemoryUserDatabase,
      })
      .then((user) => {
        deepStrictEqual(inMemoryUserDatabase.users[0], user);
        deepStrictEqual(inMemoryUserDatabase.users.length, 1);
        ok(user instanceof User);
      });
  });

  it("should not be able to register new user with invalid data", async () => {
    await rejects(
      async () =>
        await new MakeUserFactory().toDomain({
          inMemoryDatabase: inMemoryUserDatabase,
          override: {
            name: "",
            job: "dev".repeat(260),
            email: "ana",
            password: "123",
          },
        }),
      NameShouldNotBeEmptyError
    );
  });

  it("should not be able to register new user with existing email", async () => {
    await new MakeUserFactory()
      .toDomain({
        inMemoryDatabase: inMemoryUserDatabase,
      })
      .then(async ({ props }) => {
        await rejects(
          async () => await registerUserUseCase.execute(props),
          UserAlreadyExistsError
        );
      });
  });
});
