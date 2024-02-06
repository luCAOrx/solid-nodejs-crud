import { deepStrictEqual, rejects } from "node:assert";
import { describe, it } from "node:test";

import { GlobalUseCaseErrors } from "@domain/use-cases/global-errors/global-use-case-errors";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryRefreshTokenDatabase } from "@test/in-memory-database/in-memory-refresh-token-database";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { GenerateRefreshToken } from "./generate-refresh-jwt-token";

describe("Generate refresh jwt token", () => {
  const inMemoryRefreshTokenDatabase = new InMemoryRefreshTokenDatabase();
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const generateRefreshJwtToken = new GenerateRefreshToken(
    inMemoryRefreshTokenDatabase,
    inMemoryUserDatabase
  );

  it("should be able create a refresh token", async () => {
    await new MakeUserFactory()
      .toDomain({
        inMemoryDatabase: inMemoryUserDatabase,
      })
      .then(async (response) => {
        await generateRefreshJwtToken
          .execute({
            userId: response.id,
          })
          .then(async (response) => {
            deepStrictEqual(
              inMemoryRefreshTokenDatabase.refreshTokens[0],
              response.refreshToken
            );
            deepStrictEqual(
              inMemoryRefreshTokenDatabase.refreshTokens.length,
              1
            );
          });
      });
  });

  it("should not be able create a refresh token with inexistent user", async () => {
    await rejects(async () => {
      await generateRefreshJwtToken.execute({
        userId: "12345678901234567890",
      });
    }, GlobalUseCaseErrors.UserNotFoundError);
  });
});
