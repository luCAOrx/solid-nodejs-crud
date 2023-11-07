import { deepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";

export function getUserControllerEndToEndTests(): void {
  describe("Get user controller", () => {
    let login: { user: { id: string }; token: string };

    before(async () => {
      login = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "joe1@example.com",
            password: "1234567890",
          },
        })
      ).json();
    });

    it("should be able get user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-user/${String(
          login.user.id
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 200);
        deepStrictEqual(responseBody, {
          id: responseBody.id,
          name: "John Doe",
          job: "doctor",
          email: "joe1@example.com",
          read_time: 1,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });
      });
    });

    it("should not be able get a user without route params of the request", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-user/`,
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
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-user/${String(
          login.user.id
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 200);
        deepStrictEqual(responseBody, {
          id: responseBody.id,
          name: "John Doe",
          job: "doctor",
          email: "joe1@example.com",
          read_time: 2,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });
      });

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-user/${String(
          login.user.id
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 200);
        deepStrictEqual(responseBody, {
          id: responseBody.id,
          name: "John Doe",
          job: "doctor",
          email: "joe1@example.com",
          read_time: 3,
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at,
        });
      });
    });

    it("should not be able get user if user not exists", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-user/12345`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
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
