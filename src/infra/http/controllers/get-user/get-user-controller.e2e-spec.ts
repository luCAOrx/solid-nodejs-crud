import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { BASE_URL } from "@test/utils/base-url";

export function getUserControllerEndToEndTests(): void {
  describe("Get user controller", () => {
    it("should be able get user", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "get-user-test1@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "get-user-test1@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/get-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 200);
        deepStrictEqual(responseBody, {
          id: responseBody.id,
          name: "John Doe",
          job: "doctor",
          email: "get-user-test1@example.com",
          read_time: 1,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });
      });
    });

    it("should not be able get a user without route params of the request", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/get-user/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 404);
        deepStrictEqual(responseBody, {
          statusCode: 404,
          message: "Page not found",
          error: "Not Found",
        });
      });
    });

    it("should be able to count how many times the user has been read", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "get-user-test2@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "get-user-test2@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/get-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 200);
        deepStrictEqual(responseBody, {
          id: responseBody.id,
          name: "John Doe",
          job: "doctor",
          email: "get-user-test2@example.com",
          read_time: 1,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });
      });

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/get-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 200);
        deepStrictEqual(responseBody, {
          id: responseBody.id,
          name: "John Doe",
          job: "doctor",
          email: "get-user-test2@example.com",
          read_time: 2,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });
      });
    });

    it("should not be able get user if user not exists", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "get-user-test3@example.com",
        },
      });
      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "get-user-test1@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/get-user/12345`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "User not found",
          error: "Bad request",
        });
      });
    });
  });
}
