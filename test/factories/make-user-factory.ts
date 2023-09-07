import { hash } from "bcryptjs";

import { User, type Role } from "@domain/entities/user/user";
import { RegisterUserUseCase } from "@domain/use-cases/register-user/register-user-use-case";
import { prisma } from "@infra/http/libs/prisma-client";
import { type User as UserPrismaClient } from "@prisma/client";
import { InMemoryUserDatabase } from "@test/in-memory-database/in-memory-user-database";
import { UserSecurityProvider } from "@test/utils/user-security-provider";

import { MakeRequestFactory } from "./make-request-factory";

interface UserProps {
  name: string;
  job: string;
  email: string;
  password: string;
  role: Role;
}

type Override = Partial<UserProps>;

export class MakeUserFactory {
  public async toDomain({
    inMemoryDatabase,
    override,
  }: {
    inMemoryDatabase: InMemoryUserDatabase;
    override?: Override;
  }): Promise<User> {
    const inMemoryUserDatabase = new InMemoryUserDatabase();
    const userSecurityProvider = new UserSecurityProvider();
    const registerUserUseCase = new RegisterUserUseCase(
      inMemoryUserDatabase,
      userSecurityProvider
    );

    const { user } = await registerUserUseCase.execute({
      name: "Joe Smith",
      job: "Development",
      email: "joe@example.com",
      password: "1234567890",
      ...override,
    });

    await inMemoryDatabase.create(user);

    return user;
  }

  public async toHttp({
    override,
  }: {
    override?: Override;
  }): Promise<Response> {
    return await MakeRequestFactory.execute({
      url: `${String(process.env.TEST_SERVER_URL)}/users/register`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: "John Doe",
        job: "Doctor",
        email: "johndoe@example.com",
        password: "1234567890",
        ...override,
      },
    });
  }
}

export class MakeAdminUserFactory {
  public toDomain({
    inMemoryDatabase,
    override,
  }: {
    inMemoryDatabase: InMemoryUserDatabase;
    override?: Override;
  }): User {
    const user = User.create({
      name: "David Wilson",
      job: "Manager",
      email: "david@example.com",
      password: "1234567890",
      role: "ADMIN",
      ...override,
    });

    inMemoryDatabase.create(user);

    return user;
  }

  public async toHttp({
    override,
  }: {
    override?: Override;
  }): Promise<UserPrismaClient> {
    const {
      id,
      props: { name, job, email, password, role },
      read_time,
      created_at,
    } = User.create({
      name: "Test Admin Name",
      job: "test admin",
      email: "test-admin@example.com",
      password: "1234567890",
      role: "ADMIN",
      ...override,
    });

    const hashedPassword = await hash(password, 14);

    const createdUser = await prisma.user.create({
      data: {
        id,
        name,
        job,
        email,
        password: hashedPassword,
        role,
        read_time,
        created_at,
      },
    });

    return createdUser;
  }
}
