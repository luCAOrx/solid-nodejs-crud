import request from "supertest";

import { app } from "@infra/http/app";

describe("API global error", () => {
  it("should be able return error 500 internal server error", async () => {
    await request(app).get("/users/get-users").expect(500, {
      statusCode: 500,
      message: "Internal server error",
      error: "Internal Server Error",
    });
  });
});
