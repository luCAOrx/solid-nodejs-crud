import { deepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";

export function ensureAuthenticatedMiddlewareEndToEndTests(): void {
  describe("Ensure authenticate middleware", () => {
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

    before(async () => {
      login = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "joe4@example.com",
            password: "1234567890",
          },
        })
      ).json();
    });

    it("should not be able execute feature without are authenticate and with token empty", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          login.user.id
        )}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 401);
        deepStrictEqual(responseBody, {
          statusCode: 401,
          message: "The token should not be empty",
          error: "Unauthorized",
        });
      });
    });

    it("should not be able execute feature without are authenticate and with token without two parts", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          login.user.id
        )}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer ",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 401);
        deepStrictEqual(responseBody, {
          statusCode: 401,
          message: "The token should be two parts",
          error: "Unauthorized",
        });
      });
    });

    it("should not be able execute feature without are authenticate and if token not start with Bearer word", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          login.user.id
        )}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer-fake ${String(login.user.id)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 401);
        deepStrictEqual(responseBody, {
          statusCode: 401,
          message: "The token should be start with Bearer word",
          error: "Unauthorized",
        });
      });
    });

    it("should not be able execute feature without are authenticate and with token invalid", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          login.user.id
        )}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer 1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 401);
        deepStrictEqual(responseBody, {
          statusCode: 401,
          message: "The token is invalid",
          error: "Unauthorized",
        });
      });
    });
  });
}
