import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { RegisterUserUseCase } from "../register-user-use-case";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { GetUserUseCase } from "./get-user-use-case";

describe("Get user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const registerUserUseCase = new RegisterUserUseCase(inMemoryUserDatabase);
  const getUserUseCase = new GetUserUseCase(inMemoryUserDatabase);

  it("should be able get user", async () => {
    const {
      user: { id },
    } = await registerUserUseCase.execute({
      name: "Bruno",
      job: "Mecânico",
      email: "bruno@example.com",
      password: "1234567890",
    });

    const { user } = await getUserUseCase.execute({ id });

    expect(inMemoryUserDatabase.exists("bruno@example.com")).toBeTruthy();
    expect(inMemoryUserDatabase.users[0]).toStrictEqual(user);
    expect(inMemoryUserDatabase.users).toHaveLength(1);
    expect(user).toBeTruthy();
    expect(user).toStrictEqual(user);
  });

  it("should not be able get user if user not exists", async () => {
    await expect(async () => {
      await getUserUseCase.execute({ id: "1234567890" });
    }).rejects.toThrowError(UserNotFoundError);
  });
});
