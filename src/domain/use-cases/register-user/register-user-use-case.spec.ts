import { User } from "@domain/entities/user";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUserUseCase } from "./register-user-use-case";

const inMemoryUserDatabase = new InMemoryUserDatabase();
const registerUserUseCase = new RegisterUserUseCase(inMemoryUserDatabase);

describe("Register user use case", () => {
  it("should be able to register new user", async () => {
    const response = await registerUserUseCase.execute({
      name: "Lucas",
      job: "Development",
      email: "lucas@example.com",
      password: "1234567890",
    });

    expect(inMemoryUserDatabase.exists("lucas@example.com")).toBeTruthy();
    expect(inMemoryUserDatabase.users[0]).toStrictEqual(response.user);
    expect(inMemoryUserDatabase.users).toHaveLength(1);
    expect(response).toBeTruthy();
    expect(response).toStrictEqual(response);
  });

  it("should not be able to register new user with invalid data", async () => {
    await expect(
      async () =>
        await registerUserUseCase.execute({
          name: "",
          job: "dev".repeat(260),
          email: "ana",
          password: "123",
        })
    ).rejects.toThrow(NameShouldNotBeEmptyError);
  });

  it("should not be able to register new user with existing email", async () => {
    const user = User.create({
      name: "Lucas",
      job: "Development",
      email: "lucas@example.com",
      password: "1234567890",
    });

    await inMemoryUserDatabase.create(user);

    await expect(
      async () =>
        await registerUserUseCase.execute({
          name: "Lucas",
          job: "Development",
          email: "lucas@example.com",
          password: "1234567890",
        })
    ).rejects.toThrow(UserAlreadyExistsError);
  });
});
