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
  private _password_reset_token: string;
  private _password_reset_token_expiration: Date;
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

  public get password_reset_token(): string {
    return this._password_reset_token;
  }

  public set password_reset_token(value: string) {
    this._password_reset_token = value;
  }

  public get password_reset_token_expiration(): Date {
    return this._password_reset_token_expiration;
  }

  public set password_reset_token_expiration(value: Date) {
    this._password_reset_token_expiration = value;
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
    password_reset_token?: string,
    password_reset_token_expiration?: Date,
    updated_at?: Date
  ) {
    this._id = id ?? randomUUID();
    this._props = props;
    this._read_time = read_time ?? 0;
    this._password_reset_token = password_reset_token ?? "";
    this._password_reset_token_expiration =
      password_reset_token_expiration ?? new Date();
    this._updated_at = updated_at ?? new Date();
    this._created_at = new Date();
  }

  static create(
    props: UserProps,
    id?: string,
    read_time?: number,
    password_reset_token?: string,
    password_reset_token_expiration?: Date,
    updated_at?: Date
  ): User {
    return new User(
      props,
      id,
      read_time,
      password_reset_token,
      password_reset_token_expiration,
      updated_at
    );
  }
}
