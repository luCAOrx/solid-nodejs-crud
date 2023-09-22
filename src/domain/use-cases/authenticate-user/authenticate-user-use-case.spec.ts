import { ok, rejects, strictEqual, notStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryRefreshTokenDatabase } from "@test/in-memory-database/in-memory-refresh-token-database";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { AuthenticateUserUseCase } from "./authenticate-user-use-case";
import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";

describe("Authenticate user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const inMemoryRefreshTokenDatabase = new InMemoryRefreshTokenDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider,
    inMemoryRefreshTokenDatabase
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
    strictEqual(
      inMemoryRefreshTokenDatabase.refreshTokens[0],
      authenticate.refreshToken
    );
    strictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
  });

  it("should be able to delete the user's existing refresh token when the user re-authenticates", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
      override: {
        email: "authenticate-user-test@example.com",
      },
    });

    const { refreshToken } = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: user.props.password,
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: user.props.password,
    });

    strictEqual(inMemoryUserDatabase.users[1], authenticate.user);
    strictEqual(inMemoryUserDatabase.users.length, 2);
    strictEqual(authenticate.user, user);
    notStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens[0], refreshToken);
    strictEqual(
      inMemoryRefreshTokenDatabase.refreshTokens[0],
      authenticate.refreshToken
    );
    strictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
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
