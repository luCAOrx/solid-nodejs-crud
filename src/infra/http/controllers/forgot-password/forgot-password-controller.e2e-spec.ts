import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { UnableToSendPasswordRecoveryEmailError } from "@domain/use-cases/forgot-password/errors/unable-to-send-password-recovery-email-error";
import { NodeMailerMailAdapter } from "@infra/http/adapters/nodemailer-mail-adapter";
import { MakeRequestFactory } from "@test/factories/make-request-factory";

export function forgotPasswordControllerEndToEndTests(): void {
  describe("Forgot password controller", () => {
    it("should be able send email to recover password", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/forgot-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: "joe5@example.com",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          message:
            "A code so you can reset your password has been sent to your email, view your inbox, spam or trash.",
        });
      });
    });

    it("should not be able to send an email to recover the password if the user's email is not found", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/forgot-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: "fake-email@example.com",
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

    it("should not be able to send email to recover password if sending email fails to send email", async () => {
      class MockNodeMailAdapter extends NodeMailerMailAdapter {
        async sendMail(options: any): Promise<void> {
          throw new UnableToSendPasswordRecoveryEmailError();
        }
      }

      NodeMailerMailAdapter.prototype.sendMail =
        MockNodeMailAdapter.prototype.sendMail;

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/forgot-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: "joe5@example.com",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "Unable to send password recovery email",
          error: "Bad request",
        });
      });
    });

    it("should not be able to send email to recover password without request body property", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/forgot-password`,
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
          message: "The property: email should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to send email to recover password if the request body property are not the same as email", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/forgot-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          fakeEmail: "joe5@example.com",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The property: email should be provided in the request body",
          error: "Bad request",
        });
      });
    });
  });
}
