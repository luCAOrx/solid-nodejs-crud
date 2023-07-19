import { type User } from "@domain/entities/user/user";
import { type UserRepository } from "@domain/repositories/user-repository";

export class InMemoryUserDatabase implements UserRepository {
  public users: User[] = [];

  async exists(email: string): Promise<boolean> {
    return this.users.some(({ props }) => props.email === email);
  }

  async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    if (user == null) return null;

    return user;
  }

  async findMany(page: number, takePage: number): Promise<User[]> {
    const usersOrUser = this.users.map((users) => users);

    return usersOrUser.slice((page - 1) * takePage, page * takePage);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.props.email === email);

    if (user == null) return null;

    return user;
  }

  async update(user: User): Promise<User> {
    const userIndex = this.users.findIndex(
      (userFound) => userFound.id === user.id
    );

    this.users[userIndex] = user;

    return user;
  }

  async delete(id: string): Promise<void> {
    const user = this.users.findIndex((user) => user.id === id);

    this.users.splice(user, 1);
  }
}
