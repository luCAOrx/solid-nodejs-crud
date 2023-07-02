import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Authenticate user controller", () => {
  it("should be able authenticate", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "test-auth@example.com",
        password: "1234567890",
      },
    });

    const {
      body: authenticateUserBody,
      statusCode: authenticateUserStatusCode,
    } = await request(app).post("/users/authenticate").send({
      email: "test-auth@example.com",
      password: "1234567890",
    });

    expect(authenticateUserStatusCode).toStrictEqual(201);
    expect(authenticateUserBody).toStrictEqual({
      user: {
        id: body.user.id,
        name: body.user.name,
        job: body.user.job,
        email: body.user.email,
        read_time: body.user.read_time,
        created_at: authenticateUserBody.user.created_at,
        updated_at: authenticateUserBody.user.updated_at,
      },
      token: authenticateUserBody.token,
    });
  });

  it("should not be able authenticate if provided email not equal that user email", async () => {
    await new MakeUserFactory().toHttp({
      override: {
        email: "test-auth@example.com",
        password: "1234567890",
      },
    });

    const {
      body: authenticateUserBody,
      statusCode: authenticateUserStatusCode,
    } = await request(app).post("/users/authenticate").send({
      email: "fake-email@example.com",
      password: "1234567890",
    });

    expect(authenticateUserStatusCode).toStrictEqual(400);
    expect(authenticateUserBody).toStrictEqual({
      statusCode: 400,
      message: "Invalid email or password",
      error: "Bad request",
    });
  });

  it("should not be able authenticate if provided password not equal that user password", async () => {
    await new MakeUserFactory().toHttp({
      override: {
        email: "test-auth@example.com",
        password: "1234567890",
      },
    });

    const {
      body: authenticateUserBody,
      statusCode: authenticateUserStatusCode,
    } = await request(app).post("/users/authenticate").send({
      email: "test-auth@example.com",
      password: "fake-password",
    });

    expect(authenticateUserStatusCode).toStrictEqual(400);
    expect(authenticateUserBody).toStrictEqual({
      statusCode: 400,
      message: "Invalid email or password",
      error: "Bad request",
    });
  });
});
