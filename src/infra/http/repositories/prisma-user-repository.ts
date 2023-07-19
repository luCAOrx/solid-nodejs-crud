import { type User } from "@domain/entities/user/user";
import { type UserRepository } from "@domain/repositories/user-repository";
import { PrismaClient } from "@prisma/client";

import { UserMapper } from "../mappers/user-mapper";

const prisma = new PrismaClient();

export class PrismaUserRepository implements UserRepository {
  async exists(email: string): Promise<boolean> {
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    return !(userAlreadyExists === null);
  }

  async create(user: User): Promise<User> {
    const {
      id,
      name,
      job,
      email,
      password,
      read_time,
      created_at,
      updated_at,
    } = UserMapper.toPersistence(user);

    const createdUser = await prisma.user.create({
      data: {
        id,
        name,
        job,
        email,
        password,
        read_time,
        created_at,
        updated_at,
      },
    });

    return UserMapper.toDomain(createdUser);
  }

  async findMany(page: number, takePage: number): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      take: takePage,
      skip: (page - 1) * takePage,
    });

    return users.map((user) => UserMapper.toDomain(user));
  }

  async findById(id: string): Promise<User | null> {
    const userOrNull = await prisma.user.findUnique({
      where: { id },
    });

    if (userOrNull === null) return null;

    return UserMapper.toDomain(userOrNull);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userOrNull = await prisma.user.findUnique({
      where: { email },
    });

    if (userOrNull === null) return null;

    return UserMapper.toDomain(userOrNull);
  }

  async update(user: User): Promise<User> {
    const raw = UserMapper.toPersistence(user);

    const updatedUser = await prisma.user.update({
      where: { id: raw.id },
      data: raw,
    });

    return UserMapper.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
