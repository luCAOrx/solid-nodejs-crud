import { ok, strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

import { PasswordShouldBeLessThan255CharactersError } from "@domain/validations/password/errors/password-should-be-less-than-255-characters-error";
import { PasswordShouldBeThan10CharactersError } from "@domain/validations/password/errors/password-should-be-than-10-characters-error";
import { PasswordShouldNotBeEmptyError } from "@domain/validations/password/errors/password-should-not-be-empty-error";

import { Password } from "./password";

describe("Password value object", () => {
  it("should be able accept valid password", () => {
    const passwordOrError = Password.create("12345ABCabc");

    ok(passwordOrError.value);
    strictEqual(passwordOrError.value, "12345ABCabc");
  });

  it("should be able reject password with empty content", () => {
    throws(() => Password.create(""), PasswordShouldNotBeEmptyError);
  });

  it("should be able reject password with more than 255 characters", () => {
    throws(
      () => Password.create("123".repeat(260)),
      PasswordShouldBeLessThan255CharactersError
    );
  });

  it("should be able reject password with less than 10 characters", () => {
    throws(
      () => Password.create("123456789"),
      PasswordShouldBeThan10CharactersError
    );
  });
});
