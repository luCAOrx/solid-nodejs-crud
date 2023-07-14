import request from "supertest";

import { app } from "@infra/http/app";

describe("API global error", () => {
  it("should be able return 404 not found error", async () => {
    await request(app).get("/fake-route").expect(404, {
      statusCode: 404,
      message: "Page not found",
      error: "Not Found",
    });
  });
});
