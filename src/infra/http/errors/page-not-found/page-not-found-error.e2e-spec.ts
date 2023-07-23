import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";

import { MakeRequestFactory } from "@test/factories/make-request-factory";
import { BASE_URL } from "@test/utils/base-url";

export function pageNotFoundErrorEndToEndTests(): void {
  describe("Page not found error", () => {
    it("should be able return 404 not found error", async () => {
      await MakeRequestFactory.execute({
        url: `${BASE_URL}/fake-route`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        const responseBody = await response.json();

        deepStrictEqual(response.status, 404);
        deepStrictEqual(responseBody, {
          statusCode: 404,
          message: "Page not found",
          error: "Not Found",
        });
      });
    });
  });
}
