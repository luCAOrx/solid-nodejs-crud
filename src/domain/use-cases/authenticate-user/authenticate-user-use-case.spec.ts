import { MakeUserFactory } from "@test/factories/make-user-factory";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { AuthenticateUserUseCase } from "./authenticate-user-use-case";
import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";

describe("Authenticate user use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    inMemoryUserDatabase
  );

  it("should be able authenticate", async () => {
    const user = await new MakeUserFactory().toDomain({
      inMemoryDatabase: inMemoryUserDatabase,
    });

    const authenticate = await authenticateUserUseCase.execute({
      email: user.props.email,
      password: user.props.password,
    });

    expect(inMemoryUserDatabase.users[0]).toStrictEqual(authenticate.user);
    expect(inMemoryUserDatabase.users).toHaveLength(1);
    expect(authenticate).toBeTruthy();
    expect(authenticate.user).toStrictEqual(user);
  });

  it("should not be able authenticate if provided email not equal that user email", async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: "frank@example.com",
        password: "1234567890",
      });
    }).rejects.toThrowError(InvalidEmailOrPasswordError);
  });

  it("should not be able authenticate if provided password not equal that user password", async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: "joe@example.com",
        password: "12345678901",
      });
    }).rejects.toThrowError(InvalidEmailOrPasswordError);
  });
});
