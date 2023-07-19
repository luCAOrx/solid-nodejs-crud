import { ok, rejects, strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { AuthenticateUserUseCase } from "./authenticate-user-use-case";
import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";

describe("Authenticate user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    inMemoryUserDatabase
  );

  it("should be able authenticate", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: user.props.password,
      isPasswordSameSaveInDatabase: true,
    });

    strictEqual(inMemoryUserDatabase.users[0], authenticate.user);
    strictEqual(inMemoryUserDatabase.users.length, 1);
    ok(authenticate);
    strictEqual(authenticate.user, user);
  });

  it("should not be able authenticate if provided email not equal that user email", async () => {
    await rejects(async () => {
      await authenticateUserUseCase.execute({
        email: "frank@example.com",
        password: "1234567890",
        isPasswordSameSaveInDatabase: true,
      });
    }, InvalidEmailOrPasswordError);
  });

  it("should not be able authenticate if provided password not equal that user password", async () => {
    await rejects(async () => {
      await authenticateUserUseCase.execute({
        email: "joe@example.com",
        password: "12345678901",
        isPasswordSameSaveInDatabase: false,
      });
    }, InvalidEmailOrPasswordError);
  });
});
