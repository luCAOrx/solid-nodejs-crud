import { randomUUID } from "node:crypto";

import { type Email } from "./email";
import { type Job } from "./job";
import { type Name } from "./name";
import { type Password } from "./password";

interface UserProps {
  name: Name;
  job: Job;
  email: Email;
  password: Password;
}

export class User {
  private readonly _id: string;
  private _props: UserProps;

  public get id(): string {
    return this._id;
  }

  public get props(): UserProps {
    return this._props;
  }

  public set props(value: UserProps) {
    this._props = value;
  }

  private constructor(props: UserProps, id?: string) {
    this._id = id ?? randomUUID();
    this._props = props;
  }

  static create(props: UserProps, id?: string): User {
    return new User(props, id);
  }
}
