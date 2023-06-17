import { PasswordShouldBeLessThan255CharactersError } from "@domain/validations/password/errors/password-should-be-less-than-255-characters-error";
import { PasswordShouldBeThan10CharactersError } from "@domain/validations/password/errors/password-should-be-than-10-characters-error";
import { PasswordShouldNotBeEmptyError } from "@domain/validations/password/errors/password-should-not-be-empty-error";

import { Password } from "./password";

describe("Password value object", () => {
  it("should be able accept valid password", () => {
    const passwordOrError = Password.create("12345ABCabc");

    expect(passwordOrError.value).toBeTruthy();
    expect(passwordOrError.value).toStrictEqual("12345ABCabc");
  });

  it("should be able reject password with empty content", () => {
    expect(() => Password.create("")).toThrowError(
      PasswordShouldNotBeEmptyError
    );
  });

  it("should be able reject password with more than 255 characters", () => {
    expect(() => Password.create("123".repeat(260))).toThrowError(
      PasswordShouldBeLessThan255CharactersError
    );
  });

  it("should be able reject password with less than 10 characters", () => {
    expect(() => Password.create("123456789")).toThrowError(
      PasswordShouldBeThan10CharactersError
    );
  });
});
