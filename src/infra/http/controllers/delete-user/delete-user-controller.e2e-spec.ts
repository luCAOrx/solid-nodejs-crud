import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { BASE_URL } from "@test/utils/base-url";

export function deleteUserControllerEndToEndTests(): void {
  describe("Delete user controller", () => {
    it("should be able delete user", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "delete-user-test1@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "delete-user-test1@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/delete-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {},
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 200);
        deepStrictEqual(responseBody, {});
      });
    });

    it("should not be able delete a user without route params of the request", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/delete-user/`,
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
      await new MakeUserFactory().toHttp({
        override: {
          email: "delete-user-test2@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "delete-user-test2@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/delete-user/fake-id`,
        method: "DELETE",
        headers: {
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
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
