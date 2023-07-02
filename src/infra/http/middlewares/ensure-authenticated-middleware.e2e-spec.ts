import request from "supertest";

import { MakeUserFactory } from "@test/factories/make-user-factory";

import { app } from "../app";

describe("Ensure authenticate middleware", () => {
  it("should not be able execute feature without are authenticate and with token empty", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "test-auth-1@example.com",
      },
    });

    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app).delete(`/users/delete-user/${String(body.user.id)}`);

    expect(deleteUserStatusCode).toStrictEqual(401);
    expect(deleteUserBody).toStrictEqual({
      statusCode: 401,
      message: "The token should not be empty",
      error: "Unauthorized",
    });
  });

  it("should not be able execute feature without are authenticate and with token without two parts", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "test-auth-2@example.com",
      },
    });

    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app)
        .delete(`/users/delete-user/${String(body.user.id)}`)
        .set("Authorization", "Bearer ");

    expect(deleteUserStatusCode).toStrictEqual(401);
    expect(deleteUserBody).toStrictEqual({
      statusCode: 401,
      message: "The token should be two parts",
      error: "Unauthorized",
    });
  });

  it("should not be able execute feature without are authenticate and if token not start with Bearer word", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "test-auth-3@example.com",
      },
    });

    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app)
        .delete(`/users/delete-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer-fake ${String(body.user.token)}`);

    expect(deleteUserStatusCode).toStrictEqual(401);
    expect(deleteUserBody).toStrictEqual({
      statusCode: 401,
      message: "The token should be start with Bearer word",
      error: "Unauthorized",
    });
  });

  it("should not be able execute feature without are authenticate and with token invalid", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "test-auth-4@example.com",
      },
    });

    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app)
        .delete(`/users/delete-user/${String(body.user.id)}`)
        .set("Authorization", "Bearer 1234567890");

    expect(deleteUserStatusCode).toStrictEqual(401);
    expect(deleteUserBody).toStrictEqual({
      statusCode: 401,
      message: "The token is invalid",
      error: "Unauthorized",
    });
  });
});
