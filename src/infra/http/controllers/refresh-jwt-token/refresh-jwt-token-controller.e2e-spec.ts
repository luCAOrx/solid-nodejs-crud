import { deepStrictEqual, notDeepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { prisma } from "@infra/http/libs/prisma-client";
import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";

export function refreshJwtTokenControllerEndToEndTests(): void {
  let login: {
    user: { id: string };
    token: string;
    refreshToken: {
      id: string;
      expiresIn: number;
      userId: string;
      createdAt: Date;
    };
  };

  let refreshToken: {
    refreshToken: {
      id: string;
      expiresIn: number;
      userId: string;
      createdAt: Date;
    };
    token: string;
  };

  before(async () => {
    login = await (
      await MakeRequestLoginFactory.execute({
        data: {
          email: "joe2@example.com",
          password: "1234567890",
        },
      })
    ).json();
  });

  describe("Refresh jwt token controller", () => {
    it("should be able refresh token", async () => {
      const sixteenSeconds = 16000;

      await new Promise((resolve) => setTimeout(resolve, sixteenSeconds));

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/refresh-token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          refreshToken: login.refreshToken.id,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        await prisma.refreshToken
          .findUnique({
            where: {
              id: login.refreshToken.id,
            },
          })
          .then((dataBaseResponse) => {
            deepStrictEqual(dataBaseResponse, null);
          });

        refreshToken = responseBody;

        deepStrictEqual(response.status, 201);
        deepStrictEqual(
          refreshToken.refreshToken.userId,
          login.refreshToken.userId
        );
        notDeepStrictEqual(login.refreshToken, {
          id: refreshToken.refreshToken.id,
          expiresIn: refreshToken.refreshToken.expiresIn,
          userId: refreshToken.refreshToken.userId,
        });
        notDeepStrictEqual(refreshToken.token, login.token);
      });
    });

    it("should be able to return the same jwt token if the refresh token is not expired", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/refresh-token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          refreshToken: refreshToken.refreshToken.id,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody.refreshToken, {});
        deepStrictEqual(responseBody.token, refreshToken.token);
      });
    });

    it("should not be able to refresh token if the refresh token id is not found", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/refresh-token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          refreshToken: login.refreshToken.id,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Refresh token not found",
          error: "Bad request",
        });
      });
    });

    it("should not be able to refresh token without properties of request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/refresh-token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The property: refreshToken, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to refresh token without refreshToken property of request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/refresh-token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          fakeProperty: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The property: refreshToken, should be provided in the request body",
          error: "Bad request",
        });
      });
    });
  });
}
