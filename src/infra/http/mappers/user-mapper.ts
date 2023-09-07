import { type Role, User } from "@domain/entities/user/user";
import { type User as Users } from "@prisma/client";

interface ToPersistenceResponse {
  id: string;
  name: string;
  job: string;
  email: string;
  password: string;
  role: Role;
  read_time: number;
  created_at: Date;
  updated_at: Date;
}

export class UserMapper {
  static toDomain(raw: Users): User {
    return User.create(
      {
        name: raw.name,
        job: raw.job,
        email: raw.email,
        password: raw.password,
        role: raw.role,
      },
      raw.id,
      Number(raw.read_time)
    );
  }

  static toPersistence({
    id,
    props: { name, job, email, password, role },
    read_time,
    updated_at,
    created_at,
  }: User): ToPersistenceResponse {
    return {
      id,
      name,
      job,
      email,
      password,
      role,
      read_time,
      created_at,
      updated_at,
    };
  }
}
