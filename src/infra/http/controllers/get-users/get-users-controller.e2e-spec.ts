import { deepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";

export function getUsersControllerEndToEndTests(): void {
  describe("Get users controller", () => {
    let login: { user: { id: string }; token: string };

    before(async () => {
      login = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "test-admin@example.com",
            password: "1234567890",
          },
        })
      ).json();
    });

    it("should be able to list users if role is admin", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
          login.user.id
        )}/?page=1&takePage=5`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        [responseBody].map(({ userOrUsers }) => {
          deepStrictEqual(response.status, 200);
          deepStrictEqual(userOrUsers.length, 5);
          deepStrictEqual(
            responseBody.userOrUsers[0].email,
            "joe1@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[1].email,
            "joe19@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[2].email,
            "joe18@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[3].email,
            "joe17@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[4].email,
            "joe16@example.com"
          );

          deepStrictEqual(responseBody.userOrUsers, userOrUsers);
        });
      });
    });

    it("should not be able to list users if user not found", async () => {
      await MakeRequestFactory.execute({
        url: `${String(
          process.env.TEST_SERVER_URL
        )}/users/get-users/1234567890/?page=1&takePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
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

    it("should not be able to list users if query params not same as page and takePage", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
          login.user.id
        )}/?fakePage=1&fakeTakePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The query parameters: page and takePage, must be provided in the query parameters of the request",
          error: "Bad request",
        });
      });
    });

    it("should not be able to list users if role is common", async () => {
      await MakeRequestLoginFactory.execute({
        data: {
          email: "joe1@example.com",
          password: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        await MakeRequestFactory.execute({
          url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
            responseBody.user.id
          )}/?`,
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${String(responseBody.token)}`,
          },
        }).then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "Access denied",
            error: "Bad request",
          });
        });
      });
    });

    it("should not be able list users without query params of the request", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
          login.user.id
        )}/?`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The query parameters: page and takePage, must be provided in the query parameters of the request",
          error: "Bad request",
        });
      });
    });

    it("should not be able to list users just with page property of the query params", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
          login.user.id
        )}/?page=1`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The query parameters: page and takePage, must be provided in the query parameters of the request",
          error: "Bad request",
        });
      });
    });

    it("should not be able to list users just with takePage property of the query params", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
          login.user.id
        )}/?takePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The query parameters: page and takePage, must be provided in the query parameters of the request",
          error: "Bad request",
        });
      });
    });

    it("should be able paginate", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
          login.user.id
        )}/?page=1&takePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        [responseBody].map(({ userOrUsers }) => {
          deepStrictEqual(response.status, 200);
          deepStrictEqual(userOrUsers.length, 5);
          deepStrictEqual(
            responseBody.userOrUsers[0].email,
            "joe1@example.com"
          );

          deepStrictEqual(
            responseBody.userOrUsers[1].email,
            "joe19@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[2].email,
            "joe18@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[3].email,
            "joe17@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[4].email,
            "joe16@example.com"
          );

          deepStrictEqual(responseBody.userOrUsers, userOrUsers);
        });
      });

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users/${String(
          login.user.id
        )}/?page=2&takePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        [responseBody].map(({ userOrUsers }) => {
          deepStrictEqual(response.status, 200);
          deepStrictEqual(
            responseBody.userOrUsers[0].email,
            "joe15@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[1].email,
            "joe14@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[2].email,
            "joe13@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[3].email,
            "joe12@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[4].email,
            "joe11@example.com"
          );

          deepStrictEqual(responseBody.userOrUsers, userOrUsers);
        });
      });
    });
  });
}
