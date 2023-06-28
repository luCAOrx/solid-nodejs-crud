import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Delete user controller", () => {
  it("should be able delete user", async () => {
    const { body } = await new MakeUserFactory().toHttp({});

    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app).delete(`/users/delete-user/${String(body.user.id)}`);

    expect(deleteUserStatusCode).toStrictEqual(200);
    expect(deleteUserBody).toStrictEqual({});
  });

  it("should not be able to delete non-existent user", async () => {
    const { body: deleteUserBody, statusCode: deleteUserStatusCode } =
      await request(app).delete("/users/delete-user/fake-id");

    expect(deleteUserStatusCode).toStrictEqual(400);
    expect(deleteUserBody).toStrictEqual({
      statusCode: 400,
      message: "User not found",
      error: "Bad request",
    });
  });
});
