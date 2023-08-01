import { randomUUID } from "node:crypto";

export type Role = "ADMIN" | "COMMON";

interface UserProps {
  name: string;
  job: string;
  email: string;
  password: string;
  role: Role;
}

export class User {
  private readonly _id: string;
  private _props: UserProps;
  private _read_time: number;
  private _updated_at: Date;
  private readonly _created_at: Date;

  public get id(): string {
    return this._id;
  }

  public get props(): UserProps {
    return this._props;
  }

  public set props(value: UserProps) {
    this._props = value;
  }

  public get created_at(): Date {
    return this._created_at;
  }

  public get read_time(): number {
    return this._read_time;
  }

  public set read_time(value: number) {
    this._read_time = value;
  }

  public get updated_at(): Date {
    return this._updated_at;
  }

  public set updated_at(value: Date) {
    this._updated_at = value;
  }

  private constructor(
    props: UserProps,
    id?: string,
    read_time?: number,
    updated_at?: Date
  ) {
    this._id = id ?? randomUUID();
    this._props = props;
    this._read_time = read_time ?? 0;
    this._updated_at = updated_at ?? new Date();
    this._created_at = new Date();
  }

  static create(
    props: UserProps,
    id?: string,
    read_time?: number,
    updated_at?: Date
  ): User {
    return new User(props, id, read_time, updated_at);
  }
}
