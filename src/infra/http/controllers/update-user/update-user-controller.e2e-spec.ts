import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Update user controller", () => {
  it("should be able update user", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test1@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test1@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank Wells",
          job: body.user.job,
          email: "frank@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(201);
    expect(updatedUserBody).toStrictEqual({
      user: {
        id: body.user.id,
        name: "Frank Wells",
        job: body.user.job,
        email: "frank@example.com",
        read_time: body.user.read_time,
        created_at: updatedUserBody.user.created_at,
        updated_at: updatedUserBody.user.updated_at,
      },
    });
  });

  it("should not be able update user that non exists", async () => {
    await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test2@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test2@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put("/users/update-user/fake-user-id")
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank Wells",
          job: "doctor",
          email: "igor@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "User not found",
      error: "Bad request",
    });
  });

  it("should not be able update user with field name empty", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test3@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test3@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "",
          job: "doctor",
          email: "robertt@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field name should not be empty",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field name more than 255 characters", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test4@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test4@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank".repeat(260),
          job: "doctor",
          email: "bobb@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field name should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field name less than 5 characters", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test5@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test5@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Fran",
          job: "doctor",
          email: "franciss@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field name should be than 5 characters",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field job empty", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test6@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test6@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "",
          email: "normamm@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field job should not be empty",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field job more than 255 characters", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test7@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test7@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doctor".repeat(260),
          email: "josephh@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field job should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field job less than 5 characters", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test8@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test8@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doc",
          email: "samm@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field job should be than 5 characters",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field invalid email", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test9@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test9@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doctor",
          email: "@example.com",
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field email should be valid email",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field email more than 255 characters", async () => {
    const domain = "c".repeat(260);

    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test10@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test10@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doctor",
          email: `gregg@${domain}.com`,
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field email should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to update user with existing email", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test11@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test11@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doctor",
          email: body.user.email,
          password: "1234567890",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The user already exists",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field password empty", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test12@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test12@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doctor",
          email: `harryy@example.com`,
          password: "",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field password should not be empty",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field password more than 255 characters", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test13@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test13@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doctor",
          email: `georgee@example.com`,
          password: "1".repeat(260),
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field password should be less than 255 characters",
      error: "Bad request",
    });
  });

  it("should not be able to update user with field password less than 10 characters", async () => {
    const { body } = await new MakeUserFactory().toHttp({
      override: {
        email: "update-user-test14@example.com",
      },
    });

    const { body: authenticateUserBody } = await request(app)
      .post("/users/authenticate")
      .send({
        email: "update-user-test14@example.com",
        password: "1234567890",
      });

    const { body: updatedUserBody, statusCode: updatedUserStatusCode } =
      await request(app)
        .put(`/users/update-user/${String(body.user.id)}`)
        .set("Authorization", `Bearer ${String(authenticateUserBody.token)}`)
        .send({
          name: "Frank",
          job: "doctor",
          email: `markk@example.com`,
          password: "12345",
        });

    expect(updatedUserStatusCode).toStrictEqual(400);
    expect(updatedUserBody).toStrictEqual({
      statusCode: 400,
      message: "The field password should be than 10 characters",
      error: "Bad request",
    });
  });
});
