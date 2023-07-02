import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Get user controller", () => {
  it("should be able get user", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "get-user-test1@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "get-user-test1@example.com",
        password: "1234567890",
      });

    const { body: userReadOneTimes, statusCode } = await request(app)
      .get(`/users/get-user/${String(body.user.id)}`)
      .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`);

    expect(statusCode).toStrictEqual(200);
    expect(userReadOneTimes).toStrictEqual({
      id: body.user.id,
      name: "John Doe",
      job: "doctor",
      email: "get-user-test1@example.com",
      read_time: 1,
      created_at: userReadOneTimes.created_at,
      updated_at: userReadOneTimes.updated_at,
    });
  });

  it("should be able to count how many times the user has been read", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "get-user-test2@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "get-user-test2@example.com",
        password: "1234567890",
      });

    const { body: userReadOneTimes, statusCode: userReadOneTimesStatusCode } =
      await request(app)
        .get(`/users/get-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`);

    expect(userReadOneTimesStatusCode).toStrictEqual(200);
    expect(userReadOneTimes).toStrictEqual({
      id: body.user.id,
      name: "John Doe",
      job: "doctor",
      email: "get-user-test2@example.com",
      read_time: 1,
      created_at: userReadOneTimes.created_at,
      updated_at: userReadOneTimes.updated_at,
    });

    const { body: userReadTwoTimes, statusCode: userReadTwoTimesStatusCode } =
      await request(app)
        .get(`/users/get-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`);

    expect(userReadTwoTimesStatusCode).toStrictEqual(200);
    expect(userReadTwoTimes).toStrictEqual({
      id: body.user.id,
      name: "John Doe",
      job: "doctor",
      email: "get-user-test2@example.com",
      read_time: 2,
      created_at: userReadTwoTimes.created_at,
      updated_at: userReadTwoTimes.updated_at,
    });
  });

  it("should not be able get user if user not exists", async () => {
    await new MakeUserFactory().toHttp({
      override: {
        email: "get-user-test3@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "get-user-test3@example.com",
        password: "1234567890",
      });

    const { body: getUserBody, statusCode: getUserStatusCode } = await request(
      app
    )
      .get("/users/get-user/12345")
      .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`);

    expect(getUserStatusCode).toStrictEqual(400);
    expect(getUserBody).toStrictEqual({
      statusCode: 400,
      message: "User not found",
      error: "Bad request",
    });
  });
});
