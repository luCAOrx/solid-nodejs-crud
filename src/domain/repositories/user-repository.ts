import { type User } from "@domain/entities/user/user";

export abstract class UserRepository {
  abstract exists(email: string): Promise<boolean>;
  abstract create(user: User): Promise<User>;
  abstract findMany(page: number, takePage: number): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
}
