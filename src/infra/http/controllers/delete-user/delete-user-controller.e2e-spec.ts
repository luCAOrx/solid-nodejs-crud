import { deepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";

export function deleteUserControllerEndToEndTests(): void {
  describe("Delete user controller", () => {
    let login: { user: { id: string }; token: string };

    before(async () => {
      login = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "joe0@example.com",
            password: "1234567890",
          },
        })
      ).json();
    });

    it("should be able delete user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/${String(
          login.user.id
        )}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {},
      }).then(async (response) => {
        const responseBody = response.body;

        deepStrictEqual(response.status, 204);
        deepStrictEqual(responseBody, null);
      });
    });

    it("should not be able delete a user without route params of the request", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/`,
        method: "DELETE",
        headers: {},
        data: {},
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

    it("should not be able to delete non-existent user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/delete-user/fake-id`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {},
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
