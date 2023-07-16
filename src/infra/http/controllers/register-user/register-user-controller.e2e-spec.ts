import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Register user controller", () => {
  it("should be able register new user", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({});

    expect(statusCode).toStrictEqual(201);
    expect(body).toStrictEqual({
      user: {
        id: body.user.id,
        name: "John Doe",
        job: "doctor",
        email: "johndoe@example.com",
        read_time: body.user.read_time,
        created_at: body.user.created_at,
        updated_at: body.user.updated_at,
      },
    });
  });

  it("should not be able to register new user without properties of request body", async () => {
    await request(app).post("/users/register").send({}).expect(500, {
      statusCode: 500,
      message:
        "The properties: name, job, email and password, should be provided in the request body",
      error: "Internal Server Error",
    });
  });

  it("should not be able to register new user just with name property of the request body", async () => {
    await request(app)
      .post("/users/register")
      .send({
        name: "Francis Fran",
      })
      .expect(500, {
        statusCode: 500,
        message:
          "The properties: name, job, email and password, should be provided in the request body",
        error: "Internal Server Error",
      });
  });

  it("should not be able to register new user just with job property of the request body", async () => {
    await request(app)
      .post("/users/register")
      .send({
        job: "Mechanic",
      })
      .expect(500, {
        statusCode: 500,
        message:
          "The properties: name, job, email and password, should be provided in the request body",
        error: "Internal Server Error",
      });
  });

  it("should not be able to register new user just with email property of the request body", async () => {
    await request(app)
      .post("/users/register")
      .send({
        email: "test@example.com",
      })
      .expect(500, {
        statusCode: 500,
        message:
          "The properties: name, job, email and password, should be provided in the request body",
        error: "Internal Server Error",
      });
  });

  it("should not be able to register new user just with password property of the request body", async () => {
    await request(app)
      .post("/users/register")
      .send({
        password: "1234512345",
      })
      .expect(500, {
        statusCode: 500,
        message:
          "The properties: name, job, email and password, should be provided in the request body",
        error: "Internal Server Error",
      });
  });

  it("should not be able to register new user with field name empty", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        name: "",
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field name should not be empty",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field name more than 255 characters", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        name: "Joe".repeat(260),
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field name should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field name less than 5 characters", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        name: "Joe",
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field name should be than 5 characters",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field job empty", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        job: "",
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field job should not be empty",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field job more than 255 characters", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        job: "Mechanic".repeat(260),
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field job should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field job less than 5 characters", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        job: "Dev",
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field job should be than 5 characters",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field invalid email", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        email: "@example.com",
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field email should be valid email",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field email more than 255 characters", async () => {
    const domain = "c".repeat(260);

    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        email: `david@${domain}.com`,
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field email should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with existing email", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({});

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The user already exists",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field password empty", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        password: "",
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field password should not be empty",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field password more than 255 characters", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        password: "1".repeat(260),
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field password should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to register new user with field password less than 10 characters", async () => {
    const { body, statusCode } = await new MakeUserFactory().toHttp({
      override: {
        password: "12345",
      },
    });

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "The field password should be than 10 characters",
      error: "Bad request",
    });
  });
});
