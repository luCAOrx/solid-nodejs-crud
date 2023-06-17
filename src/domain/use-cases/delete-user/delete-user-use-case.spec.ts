import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserNotFoundError } from "../errors/user-not-found-error";
import { RegisterUserUseCase } from "../register-user/register-user-use-case";
import { DeleteUserUseCase } from "./delete-user-use-case";

describe("Delete user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const registerUserUseCase = new RegisterUserUseCase(inMemoryUserDatabase);
  const deleteUserUseCase = new DeleteUserUseCase(inMemoryUserDatabase);

  it("should be able delete user", async () => {
    const {
      user: { id },
    } = await registerUserUseCase.execute({
      name: "Paulo",
      job: "Doctor",
      email: "paulo@example.com",
      password: "1234567890",
    });

    expect(inMemoryUserDatabase.users.length).toEqual(1);

    await deleteUserUseCase.execute({
      id,
    });

    expect(inMemoryUserDatabase.users.length).toEqual(0);
  });

  it("should not be able to delete non-existent user", async () => {
    await expect(
      async () => await deleteUserUseCase.execute({ id: "1234567890" })
    ).rejects.toThrowError(UserNotFoundError);
  });
});
