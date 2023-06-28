import request from "supertest";

import { app } from "@infra/http/app";
import { MakeUserFactory } from "@test/factories/make-user-factory";

describe("Get users controller", () => {
  beforeAll(async () => {
    for (let i = 0; i < 20; i++) {
      await new MakeUserFactory().toHttp({
        override: {
          email: `joe${i}@example.com`,
        },
      });
    }
  });

  it("should be able list users", async () => {
    const { body, statusCode } = await request(app)
      .get("/users/get-users")
      .query({ page: 1, takePage: 5 });

    [body].map(({ userOrUsers }) => {
      expect(statusCode).toStrictEqual(200);
      expect(body.userOrUsers).toHaveLength(5);
      expect(body.userOrUsers[0].email).toStrictEqual("joe19@example.com");
      expect(body.userOrUsers[1].email).toStrictEqual("joe18@example.com");
      expect(body.userOrUsers[2].email).toStrictEqual("joe17@example.com");
      expect(body.userOrUsers[3].email).toStrictEqual("joe16@example.com");
      expect(body.userOrUsers[4].email).toStrictEqual("joe15@example.com");

      expect(body.userOrUsers).toStrictEqual(userOrUsers);
    });
  });

  it("should be able paginate", async () => {
    const { body: pageOneBodyResponse, statusCode: pageOneStatusCode } =
      await request(app)
        .get("/users/get-users")
        .query({ page: 1, takePage: 5 });

    [pageOneBodyResponse].map(({ userOrUsers }) => {
      expect(pageOneStatusCode).toStrictEqual(200);
      expect(pageOneBodyResponse.userOrUsers).toHaveLength(5);
      expect(pageOneBodyResponse.userOrUsers[0].email).toStrictEqual(
        "joe19@example.com"
      );
      expect(pageOneBodyResponse.userOrUsers[1].email).toStrictEqual(
        "joe18@example.com"
      );
      expect(pageOneBodyResponse.userOrUsers[2].email).toStrictEqual(
        "joe17@example.com"
      );
      expect(pageOneBodyResponse.userOrUsers[3].email).toStrictEqual(
        "joe16@example.com"
      );
      expect(pageOneBodyResponse.userOrUsers[4].email).toStrictEqual(
        "joe15@example.com"
      );

      expect(pageOneBodyResponse.userOrUsers).toStrictEqual(userOrUsers);
    });

    const { body: pageTwoBodyResponse, statusCode: pageTwoStatusCode } =
      await request(app)
        .get("/users/get-users")
        .query({ page: 2, takePage: 5 });

    [pageTwoBodyResponse].map(({ userOrUsers }) => {
      expect(pageTwoStatusCode).toStrictEqual(200);
      expect(pageTwoBodyResponse.userOrUsers).toHaveLength(5);

      expect(pageTwoBodyResponse.userOrUsers[0].email).toStrictEqual(
        "joe14@example.com"
      );
      expect(pageTwoBodyResponse.userOrUsers[1].email).toStrictEqual(
        "joe13@example.com"
      );
      expect(pageTwoBodyResponse.userOrUsers[2].email).toStrictEqual(
        "joe12@example.com"
      );
      expect(pageTwoBodyResponse.userOrUsers[3].email).toStrictEqual(
        "joe11@example.com"
      );
      expect(pageTwoBodyResponse.userOrUsers[4].email).toStrictEqual(
        "joe10@example.com"
      );

      expect(pageTwoBodyResponse.userOrUsers).toStrictEqual(userOrUsers);
    });
  });
});
