import { deepStrictEqual } from "node:assert";
import { describe, before, it } from "node:test";

import { prisma } from "@infra/http/libs/prisma-client";
import { type User } from "@prisma/client";
import { MakeRequestFactory } from "@test/factories/make-request-factory";

export function resetPasswordControllerEndToEndTests(): void {
  describe("Reset password controller", () => {
    let user: User;

    before(async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/forgot-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: "joe6@example.com",
        },
      });

      await prisma.user
        .findUnique({
          where: {
            email: "joe6@example.com",
          },
        })
        .then((response) => {
          if (response !== null) {
            user = response;
          }
        });
    });

    it("should be able reset password", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          message: "Password recovered successfully",
        });
      });
    });

    it("should not be able reset password if user not found", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: "fake-email@example.com",
          code: user.password_reset_token,
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
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

    it("should not be able reset password if reset password code is invalid", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: "invalidResetPasswordCode",
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Invalid code to reset password",
          error: "Bad request",
        });
      });
    });

    it("should not be able reset password if reset password token has expired", async () => {
      const currentDate = new Date();

      const delayTimeByOneHour = (): Date => {
        const oneHourBefore = new Date(currentDate.getTime() - 60 * 60 * 1000);

        return oneHourBefore;
      };

      await prisma.user.update({
        where: { id: user.id },
        data: { password_reset_token_expiration: delayTimeByOneHour() },
      });

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Password reset token has expired",
          error: "Bad request",
        });
      });
    });

    it("should not be able reset password if confirmPassword do not match newPassword", async () => {
      const currentDate = new Date();

      await prisma.user.update({
        where: { id: user.id },
        data: { password_reset_token_expiration: currentDate },
      });

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          newPassword: "newPassword123",
          confirmPassword: "newPassword1234",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Passwords do not match",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password with field newPassword empty", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          newPassword: "",
          confirmPassword: "",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field newPassword should not be empty",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password with field newPassword less than 10 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          newPassword: "12345",
          confirmPassword: "12345",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field newPassword should be greater than 10 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password with field newPassword more than 255 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          newPassword: "newPassword123".repeat(260),
          confirmPassword: "newPassword123".repeat(260),
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field newPassword should be less than 255 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able reset password without request body properties", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able reset password if the request body properties are not the same as email, code, newPassword and confirmPassword", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          fameEmail: user.email,
          fakeCode: user.password_reset_token,
          fakeNewPassword: "newPassword123",
          fakeConfirmPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password without property email from request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          code: user.password_reset_token,
          newPassword: "newPassword123".repeat(260),
          confirmPassword: "newPassword123".repeat(260),
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password without property code from request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          newPassword: "newPassword123".repeat(260),
          confirmPassword: "newPassword123".repeat(260),
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Invalid code to reset password",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password without property newPassword request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          confirmPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password without property confirmPassword request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
          code: user.password_reset_token,
          newPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Passwords do not match",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password just with property email request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: user.email,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Invalid code to reset password",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password just with property code request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          code: user.password_reset_token,
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password just with property newPassword request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          newPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to reset password just with property confirmPassword request body", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/reset-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          confirmPassword: "newPassword123",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: email, code, newPassword and confirmPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });
  });
}
