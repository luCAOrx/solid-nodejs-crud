import { deepStrictEqual, ok, throws } from "node:assert";
import { describe, it } from "node:test";
import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";

import { Email } from "./email";

describe("Email value object", () => {
  it("should be able accept valid email address", () => {
    const emailOrError = Email.create("jhondoe@example.com");

    ok(emailOrError.value);
    deepStrictEqual(emailOrError.value, "jhondoe@example.com");
  });

  it("should be able reject invalid email address", () => {
    throws(
      () => Email.create(""),
      ValueObjectErrors.ValueObjectShouldBeValidValueObjectError
    );

    throws(
      () => Email.create("johndoe"),
      ValueObjectErrors.ValueObjectShouldBeValidValueObjectError
    );

    throws(
      () => Email.create("johndoe@example"),
      ValueObjectErrors.ValueObjectShouldBeValidValueObjectError
    );

    throws(
      () => Email.create("@example.com"),
      ValueObjectErrors.ValueObjectShouldBeValidValueObjectError
    );

    throws(
      () => Email.create("johndoe@example."),
      ValueObjectErrors.ValueObjectShouldBeValidValueObjectError
    );
  });

  it("should be able reject emails with more than 255 characters", () => {
    const domain = "c".repeat(260);

    throws(
      () => Email.create(`johndoe@${domain}.com`),
      ValueObjectErrors.ValueObjectShouldBeLessThanError
    );
  });
});
