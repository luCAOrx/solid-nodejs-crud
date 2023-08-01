import { strictEqual, ok, rejects } from "node:assert";
import { describe, it } from "node:test";

import { User } from "@domain/entities/user/user";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUserUseCase } from "./register-user-use-case";

const inMemoryUserDatabase = new InMemoryUserDatabase();
const registerUserUseCase = new RegisterUserUseCase(inMemoryUserDatabase);

describe("Register user use case", () => {
  it("should be able to register new user", async () => {
    const response = await registerUserUseCase.execute({
      name: "Lucas",
      job: "Development",
      email: "lucas@example.com",
      password: "1234567890",
    });

    ok(inMemoryUserDatabase.exists("lucas@example.com"));
    strictEqual(inMemoryUserDatabase.users[0], response.user);
    strictEqual(inMemoryUserDatabase.users.length, 1);
    ok(response);
    strictEqual(response, response);
  });

  it("should not be able to register new user with invalid data", async () => {
    await rejects(
      async () =>
        await registerUserUseCase.execute({
          name: "",
          job: "dev".repeat(260),
          email: "ana",
          password: "123",
        }),
      NameShouldNotBeEmptyError
    );
  });

  it("should not be able to register new user with existing email", async () => {
    const user = User.create({
      name: "Lucas",
      job: "Development",
      email: "lucas@example.com",
      password: "1234567890",
      role: "COMMON",
    });

    await inMemoryUserDatabase.create(user);

    await rejects(
      async () =>
        await registerUserUseCase.execute({
          name: "Lucas",
          job: "Development",
          email: "lucas@example.com",
          password: "1234567890",
        }),
      UserAlreadyExistsError
    );
  });
});
