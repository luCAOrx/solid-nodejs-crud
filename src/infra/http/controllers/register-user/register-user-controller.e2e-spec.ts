import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { BASE_URL } from "@test/utils/base-url";

export function registerUserControllerEndToEndTests(): void {
  describe("Register user controller", () => {
    it("should be able register new user", async () => {
      await new MakeUserFactory().toHttp({}).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 201);
        deepStrictEqual(responseBody, {
          user: {
            id: responseBody.user.id,
            name: "John Doe",
            job: "doctor",
            email: "johndoe@example.com",
            read_time: responseBody.user.read_time,
            created_at: responseBody.user.created_at,
            updated_at: responseBody.user.updated_at,
          },
        });
      });
    });

    it("should not be able to register new user with existing email", async () => {
      await new MakeUserFactory().toHttp({});

      await new MakeUserFactory().toHttp({}).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 400);
        deepStrictEqual(responseBody, {
          statusCode: 400,
          message: "The user already exists",
          error: "Bad request",
        });
      });
    });

    it("should not be able to register new user without properties of request body", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: name, job, email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to register new user just with name property of the request body", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { name: "Francis Fran" },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: name, job, email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to register new user just with job property of the request body", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { job: "Mechanic" },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: name, job, email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to register new user just with email property of the request body", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { email: "test@example.com" },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: name, job, email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to register new user just with password property of the request body", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/users/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { password: "1234512345" },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 500);
        deepStrictEqual(responseBody, {
          statusCode: 500,
          message:
            "The properties: name, job, email and password, should be provided in the request body",
          error: "Internal Server Error",
        });
      });
    });

    it("should not be able to register new user with field name empty", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { name: "" } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field name should not be empty",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field name more than 255 characters", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { name: "Joe".repeat(260) } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field name should be less than 255 characters",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field name less than 5 characters", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { name: "Joe" } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field name should be than 5 characters",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field job empty", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { job: "" } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field job should not be empty",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field job more than 255 characters", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { job: "Mechanic".repeat(260) } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field job should be less than 255 characters",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field job less than 5 characters", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { job: "Mec" } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field job should be than 5 characters",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field invalid email", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { email: "@example.com" } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field email should be valid email",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field email more than 255 characters", async () => {
      const domain = "c".repeat(260);
      await new MakeUserFactory()
        .toHttp({ override: { email: `david@${domain}.com` } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field email should be less than 255 characters",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field password empty", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { password: "" } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field password should not be empty",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field password more than 255 characters", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { password: "1".repeat(260) } })
        .then(async (response) => {
          const responseBody = await response.json();

          deepStrictEqual(response.status, 400);
          deepStrictEqual(responseBody, {
            statusCode: 400,
            message: "The field password should be less than 255 characters",
            error: "Bad request",
          });
        });
    });

    it("should not be able to register new user with field password less than 10 characters", async () => {
      await new MakeUserFactory()
        .toHttp({ override: { password: "12345" } })
        .then(async (response) => {
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
