import { deepStrictEqual, notDeepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { prisma } from "@infra/http/libs/prisma-client";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";

export function authenticateUserControllerEndToEndTests(): void {
  describe("Authenticate user controller", () => {
    let login: {
      user: {
        id: string;
        name: string;
        job: string;
        email: string;
        read_time: number;
        created_at: Date;
        updated_at: Date;
      };
      token: string;
      refreshToken: {
        id: string;
        expiresIn: number;
        userId: string;
        createdAt: Date;
      };
    };

    it("should be able authenticate", async () => {
      await MakeRequestLoginFactory.execute({
        data: {
          email: "joe1@example.com",
          password: "1234567890",
        },
      }).then(async (response) => {
        login = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(login, {
          user: {
            id: login.user.id,
            name: "John Doe",
            job: "doctor",
            email: "joe1@example.com",
            read_time: 0,
            created_at: login.user.created_at,
            updated_at: login.user.updated_at,
          },
          token: login.token,
          refreshToken: login.refreshToken,
        });
      });
    });

    it("should be able to delete the user's existing refresh token when the user re-authenticates", async () => {
      await MakeRequestLoginFactory.execute({
        data: {
          email: "joe1@example.com",
          password: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        await prisma.refreshToken
          .findUnique({
            where: {
              id: login.refreshToken.id,
            },
          })
          .then((response) => {
            deepStrictEqual(response, null);
          });

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "John Doe",
            job: "doctor",
            email: "joe1@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
          token: responseBody.token,
          refreshToken: responseBody.refreshToken,
        });
        notDeepStrictEqual(responseBody.refreshToken.id, login.refreshToken.id);
      });
    });

    it("should not be able to authenticate user without properties of request body", async () => {
      await MakeRequestLoginFactory.execute({
        data: {},
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to authenticate user if properties of request body not same as email and password", async () => {
      await MakeRequestLoginFactory.execute({
        data: {
          fakeEmail: "llllll",
          fakePassword: "nnnnnnn",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to authenticate user just with email property of request body", async () => {
      await MakeRequestLoginFactory.execute({
        data: { email: "joe1@example.com" },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to authenticate user just with password property of request body", async () => {
      await MakeRequestLoginFactory.execute({
        data: {
          password: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email and password, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able authenticate if provided email not equal that user email", async () => {
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
      await MakeRequestLoginFactory.execute({
        data: {
          email: "joe1@example.com",
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
