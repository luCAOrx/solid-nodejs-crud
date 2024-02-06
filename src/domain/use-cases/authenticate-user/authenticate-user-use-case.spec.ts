import { ok, rejects, deepStrictEqual, notDeepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { type User } from "@domain/entities/user/user";
import { type RefreshTokenProps } from "@domain/repositories/refresh-token-repository";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryRefreshTokenDatabase } from "@test/in-memory-database/in-memory-refresh-token-database";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import AuthenticateUserUseCase from "./authenticate-user-use-case";
import { AuthenticateUserUseCaseErrors } from "./errors/authenticate-user-use-case-errors";

describe("Authenticate user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const inMemoryRefreshTokenDatabase = new InMemoryRefreshTokenDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider,
    inMemoryRefreshTokenDatabase
  );

  let user: User;

  let login: {
    user: User;
    token: string;
    refreshToken: RefreshTokenProps;
  };

  before(async () => {
    user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });
  });

  it("should be able authenticate", async () => {
    await authenticateUserUseCase
      .execute({
        email: user.props.email,
        password: "1234567890",
      })
      .then((response) => {
        deepStrictEqual(inMemoryUserDatabase.users[0], response.user);
        deepStrictEqual(inMemoryUserDatabase.users.length, 1);
        ok(response);
        deepStrictEqual(response.user, user);
        deepStrictEqual(
          inMemoryRefreshTokenDatabase.refreshTokens[0],
          response.refreshToken
        );
        deepStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);

        login = response;
      });
  });

  it("should be able to delete the user's existing refresh token when the user re-authenticates", async () => {
    await authenticateUserUseCase
      .execute({
        email: user.props.email,
        password: "1234567890",
      })
      .then((response) => {
        deepStrictEqual(inMemoryUserDatabase.users[0], response.user);
        deepStrictEqual(inMemoryUserDatabase.users.length, 1);
        deepStrictEqual(response.user, user);
        deepStrictEqual(
          inMemoryRefreshTokenDatabase.refreshTokens[0],
          response.refreshToken
        );
        deepStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
        notDeepStrictEqual(
          inMemoryRefreshTokenDatabase.refreshTokens[0],
          login.refreshToken
        );
      });
  });

  it("should not be able authenticate if provided email not equal that user email", async () => {
    await rejects(async () => {
      await authenticateUserUseCase.execute({
        email: "frank@example.com",
        password: "1234567890",
      });
    }, AuthenticateUserUseCaseErrors.InvalidEmailOrPasswordError);
  });

  it("should not be able authenticate if provided password not equal that user password", async () => {
    await rejects(async () => {
      await authenticateUserUseCase.execute({
        email: user.props.email,
        password: "123456789012312",
      });
    }, AuthenticateUserUseCaseErrors.InvalidEmailOrPasswordError);
  });
});
