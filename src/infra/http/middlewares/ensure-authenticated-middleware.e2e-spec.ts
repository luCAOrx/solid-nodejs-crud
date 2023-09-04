import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";

export function ensureAuthenticatedMiddlewareEndToEndTests(): void {
  describe("Ensure authenticate middleware", () => {
    it("should not be able execute feature without are authenticate and with token empty", async () => {
      const registerUserResponse = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "test-auth-1@example.com",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          registerUserResponse.user.id
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
      const registerUserResponse = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "test-auth-2@example.com",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          registerUserResponse.user.id
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
      const registerUserResponse = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "test-ensure-authenticate3@example.com",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          registerUserResponse.user.id
        )}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer-fake ${String(registerUserResponse.user.id)}`,
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
      const registerUserResponse = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "test-auth4@example.com",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          registerUserResponse.user.id
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
