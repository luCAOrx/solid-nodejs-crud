import { deepStrictEqual, ok, rejects } from "node:assert";
import { describe, it, before } from "node:test";

import { type User } from "@domain/entities/user/user";
import {
  MakeAdminUserFactory,
  MakeUserFactory,
} from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { AccessDeniedError } from "./errors/access-denied-error";
import { GetUsersUseCase } from "./get-users-use-case";

describe("Get users use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();

  const getUsersUseCase = new GetUsersUseCase(inMemoryUserDatabase);

  let adminUser: User;
  let commonUser: User;

  before(async () => {
    adminUser = new MakeAdminUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    for (let i = 0; i < 20; i++) {
      commonUser = await new MakeUserFactory().toDomain({
        inMemoryDatabase: inMemoryUserDatabase,
        override: {
          email: `joe${i}@example.com`,
        },
      });
    }
  });

  it("should be able to list users if role is admin", async () => {
    await getUsersUseCase.execute({ id: adminUser.id }).then((response) => {
      deepStrictEqual(response.length, 5);
      deepStrictEqual(response[0].props.email, "david@example.com");
      deepStrictEqual(response[1].props.email, "joe0@example.com");
      deepStrictEqual(response[2].props.email, "joe1@example.com");
      deepStrictEqual(response[3].props.email, "joe2@example.com");
      deepStrictEqual(response[4].props.email, "joe3@example.com");
      ok(response instanceof Object);
    });
  });

  it("should not be able to list users if user not found", async () => {
    await rejects(async () => {
      await getUsersUseCase.execute({ id: "1234567890" });
    }, UserNotFoundError);
  });

  it("should not be able to list users if role is common", async () => {
    await rejects(async () => {
      await getUsersUseCase.execute({ id: commonUser.id });
    }, AccessDeniedError);
  });

  it("should be able paginate", async () => {
    await getUsersUseCase
      .execute({
        id: adminUser.id,
        page: 1,
        takePage: 5,
      })
      .then((response) => {
        deepStrictEqual(response.length, 5);
        deepStrictEqual(response[0].props.email, "david@example.com");
        deepStrictEqual(response[1].props.email, "joe0@example.com");
        deepStrictEqual(response[2].props.email, "joe1@example.com");
        deepStrictEqual(response[3].props.email, "joe2@example.com");
        deepStrictEqual(response[4].props.email, "joe3@example.com");
        ok(response instanceof Object);
      });

    await getUsersUseCase
      .execute({
        id: adminUser.id,
        page: 2,
        takePage: 5,
      })
      .then((response) => {
        deepStrictEqual(response.length, 5);
        deepStrictEqual(response[0].props.email, "joe4@example.com");
        deepStrictEqual(response[1].props.email, "joe5@example.com");
        deepStrictEqual(response[2].props.email, "joe6@example.com");
        deepStrictEqual(response[3].props.email, "joe7@example.com");
        deepStrictEqual(response[4].props.email, "joe8@example.com");
        ok(response instanceof Object);
      });
  });
});
