import { deepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";

export function getUsersControllerEndToEndTests(): void {
  describe("Get users controller", () => {
    before(async () => {
      for (let i = 0; i < 20; i++) {
        await new MakeUserFactory().toHttp({
          override: {
            email: `joe${i}@example.com`,
          },
        });
      }
      console.log("Registering 20 users");
    });

    it("should be able list users", async () => {
      await MakeRequestFactory.execute({
        url: `${String(
          process.env.TEST_SERVER_URL
        )}/users/get-users?page=1&takePage=5`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        [responseBody].map(({ userOrUsers }) => {
          deepStrictEqual(response.status, 200);
          deepStrictEqual(userOrUsers.length, 5);
          deepStrictEqual(
            responseBody.userOrUsers[0].email,
            "joe19@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[1].email,
            "joe18@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[2].email,
            "joe17@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[3].email,
            "joe16@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[4].email,
            "joe15@example.com"
          );

          deepStrictEqual(responseBody.userOrUsers, userOrUsers);
        });
      });
    });

    it("should not be able list users without query params of the request", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users?`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The query parameters: page and takePage, must be provided in the query parameters of the request",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to list users just with page property of the query params", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/get-users?page=1`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The query parameters: page and takePage, must be provided in the query parameters of the request",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to list users just with takePage property of the query params", async () => {
      await MakeRequestFactory.execute({
        url: `${String(
          process.env.TEST_SERVER_URL
        )}/users/get-users?takePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The query parameters: page and takePage, must be provided in the query parameters of the request",
          error: "Internal Server Error",
        });
      });
    });

    it("should be able paginate", async () => {
      await MakeRequestFactory.execute({
        url: `${String(
          process.env.TEST_SERVER_URL
        )}/users/get-users?page=1&takePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        [responseBody].map(({ userOrUsers }) => {
          deepStrictEqual(response.status, 200);
          deepStrictEqual(userOrUsers.length, 5);
          deepStrictEqual(
            responseBody.userOrUsers[0].email,
            "joe19@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[1].email,
            "joe18@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[2].email,
            "joe17@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[3].email,
            "joe16@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[4].email,
            "joe15@example.com"
          );

          deepStrictEqual(responseBody.userOrUsers, userOrUsers);
        });
      });

      await MakeRequestFactory.execute({
        url: `${String(
          process.env.TEST_SERVER_URL
        )}/users/get-users?page=2&takePage=5`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        [responseBody].map(({ userOrUsers }) => {
          deepStrictEqual(response.status, 200);
          deepStrictEqual(
            responseBody.userOrUsers[0].email,
            "joe14@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[1].email,
            "joe13@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[2].email,
            "joe12@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[3].email,
            "joe11@example.com"
          );
          deepStrictEqual(
            responseBody.userOrUsers[4].email,
            "joe10@example.com"
          );

          deepStrictEqual(responseBody.userOrUsers, userOrUsers);
        });
      });
    });
  });
}
