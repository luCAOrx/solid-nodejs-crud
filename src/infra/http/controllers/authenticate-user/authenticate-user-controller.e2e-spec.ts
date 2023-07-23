import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";

export function authenticateUserControllerEndToEndTests(): void {
  describe("Authenticate user controller", () => {
    it("should be able authenticate", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "test-auth@example.com",
          password: "1234567890",
        },
      });

      await MakeRequestLoginFactory.execute({
        data: {
          email: "test-auth@example.com",
          password: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "John Doe",
            job: "doctor",
            email: "test-auth@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
          token: responseBody.token,
        });
      });
    });

    it("should not be able to authenticate user without properties of request body", async () => {
      await MakeRequestLoginFactory.execute({
        data: {},
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to authenticate user just with email property of request body", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "test@example.com",
          password: "1234567890",
        },
      });

      await MakeRequestLoginFactory.execute({
        data: { email: "test@example.com" },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to authenticate user just with password property of request body", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "test-auth1@example.com",
          password: "1234567890",
        },
      });

      await MakeRequestLoginFactory.execute({
        data: {
          password: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able authenticate if provided email not equal that user email", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "test-auth2@example.com",
          password: "1234567890",
        },
      });

      await MakeRequestLoginFactory.execute({
        data: {
          email: "fake-email@example.com",
          password: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Invalid email or password",
          error: "Bad request",
        });
      });
    });

    it("should not be able authenticate if provided password not equal that user password", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "test-auth3@example.com",
          password: "1234567890",
        },
      });

      await MakeRequestLoginFactory.execute({
        data: {
          email: "test-auth3@example.com",
          password: "fake-password",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Invalid email or password",
          error: "Bad request",
        });
      });
    });
  });
}
