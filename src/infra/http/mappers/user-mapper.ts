import { User } from "@domain/entities/user";
import { type User as Users } from "@prisma/client";

interface ToPersistenceResponse {
  id: string;
  name: string;
  job: string;
  email: string;
  password: string;
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
      },
      raw.id
    );
  }

  static toPersistence(user: User): ToPersistenceResponse {
    return {
      id: user.id,
      name: user.props.name,
      job: user.props.job,
      email: user.props.email,
      password: user.props.password,
      read_time: user.read_time,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
