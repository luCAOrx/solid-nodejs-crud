import { EmailShouldBeLessThan255CharactersError } from "@domain/validations/email/errors/email-should-be-less-than-255-characters-error";
import { EmailShouldBeValidEmailError } from "@domain/validations/email/errors/email-should-be-valid-email-error";

import { Email } from "./email";

describe("Email value object", () => {
  it("should be able accept valid email address", () => {
    const emailOrError = Email.create("jhondoe@example.com");

    expect(emailOrError.value).toBeTruthy();
    expect(emailOrError.value).toStrictEqual("jhondoe@example.com");
  });

  it("should be able reject invalid email address", () => {
    expect(() => Email.create("")).toThrowError(EmailShouldBeValidEmailError);

    expect(() => Email.create("johndoe")).toThrowError(
      EmailShouldBeValidEmailError
    );

    expect(() => Email.create("johndoe@example")).toThrowError(
      EmailShouldBeValidEmailError
    );

    expect(() => Email.create("@example.com")).toThrowError(
      EmailShouldBeValidEmailError
    );

    expect(() => Email.create("johndoe@example.")).toThrowError(
      EmailShouldBeValidEmailError
    );
  });

  it("should be able reject emails with more than 255 characters", () => {
    const domain = "c".repeat(260);

    expect(() => Email.create(`johndoe@${domain}.com`)).toThrowError(
      EmailShouldBeLessThan255CharactersError
    );
  });
});
