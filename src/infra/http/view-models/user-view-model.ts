import { type User } from "@domain/entities/user/user";

export interface ToHttpResponse {
  id: string;
  name: string;
  job: string;
  email: string;
  read_time?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class UserViewModel {
  static toHttp({
    id,
    props: { name, job, email },
    read_time,
    created_at,
    updated_at,
  }: User): ToHttpResponse {
    return {
      id,
      name,
      job,
      email,
      read_time,
      created_at,
      updated_at,
    };
  }
}
