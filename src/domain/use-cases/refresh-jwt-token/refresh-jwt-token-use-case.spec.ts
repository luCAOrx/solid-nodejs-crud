import { deepStrictEqual, rejects, notDeepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { type User } from "@domain/entities/user/user";
import { type RefreshTokenProps } from "@domain/repositories/refresh-token-repository";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryRefreshTokenDatabase } from "@test/in-memory-database/in-memory-refresh-token-database";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import AuthenticateUserUseCase from "../authenticate-user/authenticate-user-use-case";
import { RefreshJwtTokenUseCaseErrors } from "./errors/refresh-jwt-token-use-case-errors";
import { RefreshJwtTokenUseCase } from "./refresh-jwt-token-use-case";

describe("Generate refresh jwt token use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const inMemoryRefreshTokenDatabase = new InMemoryRefreshTokenDatabase();
  const userSecurityProvider = new UserSecurityProvider();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    inMemoryUserDatabase,
    userSecurityProvider,
    inMemoryRefreshTokenDatabase
  );

  const refreshJwtTokenUseCase = new RefreshJwtTokenUseCase(
    inMemoryRefreshTokenDatabase,
    inMemoryUserDatabase,
    userSecurityProvider
  );

  let authenticate: {
    user: User;
    token: string;
    refreshToken: RefreshTokenProps;
  };

  before(async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    authenticate = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: "1234567890",
    });
  });

  it("should be able to refresh token", async () => {
    const sixteenSeconds = 16000;

    await new Promise((resolve) => setTimeout(resolve, sixteenSeconds));

    await refreshJwtTokenUseCase
      .execute({
        refreshTokenId: authenticate.refreshToken.id,
      })
      .then(async ({ token, refreshToken }) => {
        await inMemoryRefreshTokenDatabase
          .findById(authenticate.refreshToken.id)
          .then((inMemoryRefreshTokenDatabaseResponse) => {
            deepStrictEqual(inMemoryRefreshTokenDatabaseResponse, null);
          });

        deepStrictEqual(
          inMemoryRefreshTokenDatabase.refreshTokens[0],
          refreshToken
        );
        deepStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
        deepStrictEqual(refreshToken?.userId, authenticate.user.id);
        notDeepStrictEqual(refreshToken, authenticate.refreshToken);
        notDeepStrictEqual(token, authenticate.token);

        authenticate = {
          user: authenticate.user,
          refreshToken: Object(refreshToken),
          token,
        };
      });
  });

  it("should not be able to refresh token if the refresh token id is not found", async () => {
    await rejects(async () => {
      await refreshJwtTokenUseCase.execute({
        refreshTokenId: "1234568080182409182",
      });
    }, RefreshJwtTokenUseCaseErrors.RefreshTokenNotFoundError);
  });

  it("should be able to return the same jwt token if the refresh token is not expired", async () => {
    await refreshJwtTokenUseCase
      .execute({
        refreshTokenId: authenticate.refreshToken.id,
      })
      .then(({ refreshToken, token }) => {
        deepStrictEqual(
          inMemoryRefreshTokenDatabase.refreshTokens[0],
          authenticate.refreshToken
        );
        deepStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
        deepStrictEqual(refreshToken, undefined);
        deepStrictEqual(token, authenticate.token);
      });
  });
});
