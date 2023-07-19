import { strictEqual, ok, throws } from "node:assert";
import { describe, it } from "node:test";

import { EmailShouldBeLessThan255CharactersError } from "@domain/validations/email/errors/email-should-be-less-than-255-characters-error";
import { EmailShouldBeValidEmailError } from "@domain/validations/email/errors/email-should-be-valid-email-error";

import { Email } from "./email";

describe("Email value object", () => {
  it("should be able accept valid email address", () => {
    const emailOrError = Email.create("jhondoe@example.com");

    ok(emailOrError.value);
    strictEqual(emailOrError.value, "jhondoe@example.com");
  });

  it("should be able reject invalid email address", () => {
    throws(() => Email.create(""), EmailShouldBeValidEmailError);

    throws(() => Email.create("johndoe"), EmailShouldBeValidEmailError);

    throws(() => Email.create("johndoe@example"), EmailShouldBeValidEmailError);

    throws(() => Email.create("@example.com"), EmailShouldBeValidEmailError);

    throws(
      () => Email.create("johndoe@example."),
      EmailShouldBeValidEmailError
    );
  });

  it("should be able reject emails with more than 255 characters", () => {
    const domain = "c".repeat(260);

    throws(
      () => Email.create(`johndoe@${domain}.com`),
      EmailShouldBeLessThan255CharactersError
    );
  });
});
