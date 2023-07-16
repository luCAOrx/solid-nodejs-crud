import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Delete user controller", () => {
  it("should be able delete user", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "delete-user-test1@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "delete-user-test1@example.com",
        password: "1234567890",
      });

    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app)
        .delete(`/users/delete-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`);

    expect(deleteUserStatusCode).toStrictEqual(200);
    expect(deleteUserBody).toStrictEqual({});
  });

  it("should not be able delete a user without route params of the request", async () => {
    await request(app).delete("/users/delete-user/").expect(404, {
      statusCode: 404,
      message: "Page not found",
      error: "Not Found",
    });
  });

  it("should not be able to delete non-existent user", async () => {
    await new MakeUserFactory().toHttp({
      override: {
        email: "delete-user-test2@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "delete-user-test2@example.com",
        password: "1234567890",
      });

    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app)
        .delete("/users/delete-user/fake-id")
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`);

    expect(deleteUserStatusCode).toStrictEqual(400);
    expect(deleteUserBody).toStrictEqual({
      statusCode: 400,
      message: "User not found",
      error: "Bad request",
    });
  });
});
