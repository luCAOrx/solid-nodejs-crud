import { deepStrictEqual } from "node:assert";
import { describe, it, before } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";

export function updateUserControllerEndToEndTests(): void {
  describe("Update user controller", () => {
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

    before(async () => {
      login = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "joe3@example.com",
            password: "1234567890",
          },
        })
      ).json();
    });

    it("should be able update all data from user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          name: "Frank Wells",
          job: "development",
          email: "frank@example.com",
          currentPassword: "1234567890",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        login.user = responseBody.user;

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "Frank Wells",
            job: "development",
            email: "frank@example.com",
            read_time: responseBody.user.read_time,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should be able update just name from user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          name: "James Wilson",
          currentPassword: "1234567890ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        login.user = responseBody.user;

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "James Wilson",
            job: "development",
            email: "frank@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should be able update just job from user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          job: "Driver",
          currentPassword: "1234567890ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        login.user = responseBody.user;

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "James Wilson",
            job: "driver",
            email: "frank@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should be able update just email from user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          email: "updated-email@example.com",
          currentPassword: "1234567890ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        login.user = responseBody.user;

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "James Wilson",
            job: "driver",
            email: "updated-email@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should be able update just password from user", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          currentPassword: "1234567890ADCDEF",
          newPassword: "123456789ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "James Wilson",
            job: "driver",
            email: "updated-email@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });

        await MakeRequestFactory.execute({
          url: `${String(process.env.TEST_SERVER_URL)}/users/refresh-token`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            refreshToken: login.refreshToken.id,
          },
        }).then(async (response) => {
          const refreshTokenResponseBody = await response.json();

          login.refreshToken = refreshTokenResponseBody.refreshToken;
          login.token = refreshTokenResponseBody.token;
        });
      });
    });

    it("should not be able to update user without route params", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ...login.user,
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
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

    it("should not be able to update user with existing email", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          email: "joe4@example.com",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The user already exists",
          error: "Bad request",
        });
      });
    });

    it("should not be able update user if current password is invalid", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          currentPassword: "fakePassword",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The current password is invalid",
          error: "Bad request",
        });
      });
    });

    it("should not be able update all data from user without request body properties", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {},
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update the user if the request body properties are not the same as name, job, email, currentPassword and newPassword", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          fakeName: "zzzzz",
          fakeJob: "xxxxx",
          fakeEmail: "lllllll",
          fakeCurrentPassword: "nnnnnn",
          fakeNewPassword: "yyyyyyy",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able update just name from user without name property", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          job: "development",
          email: "frank@example.com",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able update just job from user without property job", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          name: "James Wilson",
          email: "frank@example.com",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able update just email from user without email property", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          name: "James Wilson",
          job: "driver",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able update just password from user without property currentPassword", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          name: "James Wilson",
          job: "driver",
          email: "updated-email@example.com",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able update just password from user without property newPassword", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          name: "James Wilson",
          job: "driver",
          email: "updated-email@example.com",
          currentPassword: "123456789ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message:
            "The properties: name, job, email, currentPassword, newPassword, should be provided in the request body",
          error: "Bad request",
        });
      });
    });

    it("should not be able update user that non exists", async () => {
      await MakeRequestFactory.execute({
        url: `${String(
          process.env.TEST_SERVER_URL
        )}/users/update-user/fake-user-id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
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

    it("should not be able update user with field name empty", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          name: "",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field name should not be empty",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field name more than 255 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          name: "Frank".repeat(260),
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field name should be less than 255 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field name less than 5 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          name: "Fran",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field name should be than 5 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field job empty", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          job: "",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field job should not be empty",
          error: "Bad request",
        });
      });

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/refresh-token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          refreshToken: login.refreshToken.id,
        },
      }).then(async (response) => {
        const refreshTokenResponseBody = await response.json();

        login.refreshToken = refreshTokenResponseBody.refreshToken;
        login.token = refreshTokenResponseBody.token;
      });
    });

    it("should not be able to update user with field job more than 255 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          job: "doctor".repeat(260),
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field job should be less than 255 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field job less than 5 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          job: "doc",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field job should be than 5 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field invalid email", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          email: "@example.com",
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field email should be valid email",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field email more than 255 characters", async () => {
      const domain = "c".repeat(260);

      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          email: `gregg@${domain}.com`,
          currentPassword: "123456789ADCDEF",
          newPassword: "1234567890ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field email should be less than 255 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field currentPassword empty", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          currentPassword: "",
          newPassword: "123456789ADCDEF",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The current password is invalid",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field newPassword empty", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          currentPassword: "123456789ADCDEF",
          newPassword: "",
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

    it("should not be able to update user with field newPassword more than 255 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          currentPassword: "123456789ADCDEF",
          newPassword: "1".repeat(260),
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

    it("should not be able to update user with field newPassword less than 10 characters", async () => {
      await MakeRequestFactory.execute({
        url: `${String(process.env.TEST_SERVER_URL)}/users/update-user/${String(
          login.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(login.token)}`,
        },
        data: {
          ...login.user,
          currentPassword: "123456789ADCDEF",
          newPassword: "12345",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field newPassword should be than 10 characters",
          error: "Bad request",
        });
      });
    });
  });
}
