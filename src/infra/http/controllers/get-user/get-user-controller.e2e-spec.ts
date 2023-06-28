import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Get user controller", () => {
  it("should be able get user", async () => {
    const { body } = await new MakeUserFactory().toHttp({});

    const { body: userReadOneTimes, statusCode } = await request(app).get(
      `/users/get-user/${String(body.user.id)}`
    );

    expect(statusCode).toStrictEqual(200);
    expect(userReadOneTimes).toStrictEqual({
      id: body.user.id,
      name: "John Doe",
      job: "doctor",
      email: "johndoe@example.com",
      read_time: 1,
      created_at: userReadOneTimes.created_at,
      updated_at: userReadOneTimes.updated_at,
    });
  });

  it("should be able to count how many times the user has been read", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "joel@example.com",
      },
    });

    const { body: userReadOneTimes, statusCode: userReadOneTimesStatusCode } =
      await request(app).get(`/users/get-user/${String(body.user.id)}`);

    expect(userReadOneTimesStatusCode).toStrictEqual(200);
    expect(userReadOneTimes).toStrictEqual({
      id: body.user.id,
      name: "John Doe",
      job: "doctor",
      email: "joel@example.com",
      read_time: 1,
      created_at: userReadOneTimes.created_at,
      updated_at: userReadOneTimes.updated_at,
    });

    const { body: userReadTwoTimes, statusCode: userReadTwoTimesStatusCode } =
      await request(app).get(`/users/get-user/${String(body.user.id)}`);

    expect(userReadTwoTimesStatusCode).toStrictEqual(200);
    expect(userReadTwoTimes).toStrictEqual({
      id: body.user.id,
      name: "John Doe",
      job: "doctor",
      email: "joel@example.com",
      read_time: 2,
      created_at: userReadTwoTimes.created_at,
      updated_at: userReadTwoTimes.updated_at,
    });
  });

  it("should not be able get user if user not exists", async () => {
    const { body, statusCode } = await request(app).get(
      "/users/get-user/12345"
    );

    expect(statusCode).toStrictEqual(400);
    expect(body).toStrictEqual({
      statusCode: 400,
      message: "User not found",
      error: "Bad request",
    });
  });
});
