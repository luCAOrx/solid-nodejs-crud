import { ok, deepStrictEqual, throws } from "node:assert";
import { describe, it } from "node:test";
import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";

import { Password } from "./password";

describe("Password value object", () => {
  it("should be able accept valid password", () => {
    const passwordOrError = Password.create("12345ABCabc");

    ok(passwordOrError.value);
    deepStrictEqual(passwordOrError.value, "12345ABCabc");
  });

  it("should be able reject password with empty content", () => {
    throws(
      () => Password.create(""),
      ValueObjectErrors.ValueObjectShouldNotBeEmptyError
    );
  });

  it("should be able reject password with more than 255 characters", () => {
    throws(
      () => Password.create("123".repeat(260)),
      ValueObjectErrors.ValueObjectShouldBeLessThanError
    );
  });

  it("should be able reject password with less than 10 characters", () => {
    throws(
      () => Password.create("123456789"),
      ValueObjectErrors.ValueObjectShouldBeGreaterThanError
    );
  });
});
