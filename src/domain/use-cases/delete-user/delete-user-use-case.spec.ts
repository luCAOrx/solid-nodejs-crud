import { deepStrictEqual, rejects } from "node:assert";
import { describe, it, before } from "node:test";

import { type User } from "@domain/entities/user/user";
import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { DeleteUserUseCase } from "./delete-user-use-case";

describe("Delete user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const deleteUserUseCase = new DeleteUserUseCase(inMemoryUserDatabase);

  let user: User;

  before(async () => {
    user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });
  });

  it("should be able delete user", async () => {
    await deleteUserUseCase.execute({
      id: user.id,
    });

    deepStrictEqual(inMemoryUserDatabase.users.length, 0);
  });

  it("should not be able to delete non-existent user", async () => {
    await rejects(async () => {
      await deleteUserUseCase.execute({ id: "1234567890" });
    }, UserNotFoundError);
  });
});
