import { deepStrictEqual, rejects, notDeepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryRefreshTokenDatabase } from "@test/in-memory-database/in-memory-refresh-token-database";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { AuthenticateUserUseCase } from "../authenticate-user/authenticate-user-use-case";
import { RefreshTokenNotFoundError } from "./errors/refresh-token-not-found-error";
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

  it("should be able refresh token", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: user.props.password,
    });

    const { refreshToken, tokenJwt } = await refreshJwtTokenUseCase.execute({
      refreshTokenId: authenticate.refreshToken.id,
    });

    deepStrictEqual(
      inMemoryRefreshTokenDatabase.refreshTokens[0],
      refreshToken
    );
    deepStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
    notDeepStrictEqual(authenticate.refreshToken, refreshToken);
    deepStrictEqual(
      tokenJwt,
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
  });

  it("should not be able to refresh token if the refresh token id is not found", async () => {
    await rejects(async () => {
      await refreshJwtTokenUseCase.execute({
        refreshTokenId: "1234568080182409182",
      });
    }, RefreshTokenNotFoundError);
  });

  it("should be able to delete refresh token if refresh token has expired", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: user.props.password,
    });

    const firstRefreshToken = await refreshJwtTokenUseCase.execute({
      refreshTokenId: authenticate.refreshToken.id,
    });

    deepStrictEqual(
      inMemoryRefreshTokenDatabase.refreshTokens[0],
      firstRefreshToken.refreshToken
    );
    deepStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
    notDeepStrictEqual(
      authenticate.refreshToken,
      firstRefreshToken.refreshToken
    );
    deepStrictEqual(
      firstRefreshToken.tokenJwt,
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );

    const timeout = setTimeout(() => {}, 20000);

    const secondaryRefreshToken = await refreshJwtTokenUseCase.execute({
      refreshTokenId: firstRefreshToken.refreshToken.id,
    });

    deepStrictEqual(
      inMemoryRefreshTokenDatabase.refreshTokens[0],
      secondaryRefreshToken.refreshToken
    );
    deepStrictEqual(inMemoryRefreshTokenDatabase.refreshTokens.length, 1);
    deepStrictEqual(
      firstRefreshToken.tokenJwt,
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
    notDeepStrictEqual(
      authenticate.refreshToken,
      secondaryRefreshToken.refreshToken
    );
    notDeepStrictEqual(
      inMemoryRefreshTokenDatabase.refreshTokens[0],
      firstRefreshToken.refreshToken
    );

    clearTimeout(timeout);
  });
});
