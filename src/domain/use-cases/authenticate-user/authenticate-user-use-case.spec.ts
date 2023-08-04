import { ok, rejects, strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { AuthenticateUserUseCase } from "./authenticate-user-use-case";
import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";

describe("Authenticate user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider
  );

  it("should be able authenticate", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: user.props.password,
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
      });
    }, InvalidEmailOrPasswordError);
  });

  it("should not be able authenticate if provided password not equal that user password", async () => {
    await rejects(async () => {
      await authenticateUserUseCase.execute({
        email: "joe@example.com",
        password: "12345678901",
      });
    }, InvalidEmailOrPasswordError);
  });
});
