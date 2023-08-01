import { ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { Email } from "../email/email";
import { Job } from "../job/job";
import { Name } from "../name/name";
import { Password } from "../password/password";
import { User } from "./user";

const name = Name.create("Lucas").value;
const job = Job.create("Development").value;
const email = Email.create("lucas@example.com").value;
const password = Password.create("1234567890").value;

describe("User model", () => {
  it("should be able to create a new common user", () => {
    const userOrError = User.create({
      name,
      job,
      email,
      password,
      role: "COMMON",
    });

    ok(userOrError);
    strictEqual(userOrError, userOrError);
  });

  it("should be able to create a new admin user", () => {
    const userOrError = User.create({
      name,
      job,
      email,
      password,
      role: "ADMIN",
    });

    ok(userOrError);
    strictEqual(userOrError, userOrError);
  });
});
