import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeRequestLoginFactory } from "@test/factories/make-request-login-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { BASE_URL } from "@test/utils/base-url";

export function updateUserControllerEndToEndTests(): void {
  describe("Update user controller", () => {
    it("should be able update all data from user", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-all-data-from-user-test@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-all-data-from-user-test@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank Wells",
          job: "development",
          email: "frank@example.com",
          password: "1234567890",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

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
      const registeredUserResponseBody = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "update-just-name-from-user-test@example.com",
          },
        })
      ).json();

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-just-name-from-user-test@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          ...registeredUserResponseBody.user,
          name: "Frank Wells",
          password: "12345678900102030405",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "Frank Wells",
            job: "doctor",
            email: "update-just-name-from-user-test@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should be able update just job from user", async () => {
      const registeredUserResponseBody = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "update-just-job-from-user-test@example.com",
          },
        })
      ).json();

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-just-job-from-user-test@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          ...registeredUserResponseBody.user,
          job: "Driver",
          password: "12345678900102030405",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "John Doe",
            job: "driver",
            email: "update-just-job-from-user-test@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should be able update just email from user", async () => {
      const registeredUserResponseBody = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "update-just-email-from-user-test@example.com",
          },
        })
      ).json();

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-just-email-from-user-test@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          ...registeredUserResponseBody.user,
          email: "updated-email-test@example.com",
          password: "12345678900102030405",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "John Doe",
            job: "doctor",
            email: "updated-email-test@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should be able update just password from user", async () => {
      const registeredUserResponseBody = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "update-just-password-from-user-test@example.com",
          },
        })
      ).json();

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-just-password-from-user-test@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          ...registeredUserResponseBody.user,
          password: "12345678900102030405",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "John Doe",
            job: "doctor",
            email: "update-just-password-from-user-test@example.com",
            read_time: 0,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should not be able to update user with existing email", async () => {
      const registeredUserResponseBody = await (
        await new MakeUserFactory().toHttp({
          override: {
            email: "update-user-with-existing-email-test@example.com",
          },
        })
      ).json();

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-with-existing-email-test@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          ...registeredUserResponseBody.user,
          email: "frank@example.com",
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

    it("should not be able to update user without route params", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: "Frank Wells",
          job: "dev",
          email: "frank@example.com",
          password: "1234567890",
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

    it("should not be able update user that non exists", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test7@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test7@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/fake-user-id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank Wells",
          job: "doctor",
          email: "igor@example.com",
          password: "1234567890",
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
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test8@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test8@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "",
          job: "doctor",
          email: "robertt@example.com",
          password: "1234567890",
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
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test9@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test9@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank".repeat(260),
          job: "doctor",
          email: "bobb@example.com",
          password: "1234567890",
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
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test10@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test10@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Fran",
          job: "doctor",
          email: "franciss@example.com",
          password: "1234567890",
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
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test11@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test11@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "",
          email: "normamm@example.com",
          password: "1234567890",
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
    });

    it("should not be able to update user with field job more than 255 characters", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test12@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test12@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "doctor".repeat(260),
          email: "josephh@example.com",
          password: "1234567890",
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
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test13@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test13@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "doc",
          email: "samm@example.com",
          password: "1234567890",
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
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test14@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test14@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "doctor",
          email: "@example.com",
          password: "1234567890",
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

      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test15@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test15@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "doctor",
          email: `gregg@${domain}.com`,
          password: "1234567890",
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

    it("should not be able to update user with field password empty", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test16@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test16@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "doctor",
          email: `harryy@example.com`,
          password: "",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field password should not be empty",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field password more than 255 characters", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test17@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test17@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "doctor",
          email: `georgee@example.com`,
          password: "1".repeat(260),
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field password should be less than 255 characters",
          error: "Bad request",
        });
      });
    });

    it("should not be able to update user with field password less than 10 characters", async () => {
      await new MakeUserFactory().toHttp({
        override: {
          email: "update-user-test18@example.com",
        },
      });

      const authenticateUserResponse = await (
        await MakeRequestLoginFactory.execute({
          data: {
            email: "update-user-test18@example.com",
            password: "1234567890",
          },
        })
      ).json();

      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/update-user/${String(
          authenticateUserResponse.user.id
        )}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${String(authenticateUserResponse.token)}`,
        },
        data: {
          name: "Frank",
          job: "doctor",
          email: `markk@example.com`,
          password: "12345",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The field password should be than 10 characters",
          error: "Bad request",
        });
      });
    });
  });
}
