import { User } from "@domain/entities/user";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";

import { GetUsersUseCase } from "./get-users-use-case";

describe("Get users use case", () => {
  const inMemoryUserDatabase = new InMemoryUserDatabase();
  const getUsersUseCase = new GetUsersUseCase(inMemoryUserDatabase);

  beforeAll(async () => {
    for (let i = 0; i < 20; i++) {
      const user = User.create({
        name: "Rafael",
        job: "Actor",
        email: `fernando${i}@example.com`,
        password: "1234567890",
      });

      await inMemoryUserDatabase.create(user);
    }
  });

  it("should be able list users", async () => {
    const usersOrUser = await getUsersUseCase.execute({});

    expect(usersOrUser.length).toEqual(5);
    expect(usersOrUser[0].props.email).toStrictEqual("fernando0@example.com");
    expect(usersOrUser[1].props.email).toStrictEqual("fernando1@example.com");
    expect(usersOrUser).toBeInstanceOf(Array<User>);
  });

  it("should be able paginate", async () => {
    let usersOrUser = await getUsersUseCase.execute({ takePage: 5 });

    expect(usersOrUser.length).toEqual(5);
    expect(usersOrUser[0].props.email).toStrictEqual("fernando0@example.com");
    expect(usersOrUser[1].props.email).toStrictEqual("fernando1@example.com");
    expect(usersOrUser).toBeInstanceOf(Array<User>);

    usersOrUser = await getUsersUseCase.execute({ page: 2, takePage: 5 });

    expect(usersOrUser.length).toEqual(5);
    expect(usersOrUser[0].props.email).toStrictEqual("fernando5@example.com");
    expect(usersOrUser[1].props.email).toStrictEqual("fernando6@example.com");
    expect(usersOrUser).toBeInstanceOf(Array<User>);
  });
});
