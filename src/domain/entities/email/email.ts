import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";
import { ValueObjectBase } from "src/core/logic/domain/value-object/value-object-base";

export class Email extends ValueObjectBase {
  private static emailAddressRegexTest(email: string): boolean {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regex.test(email)) {
      return false;
    }

    return true;
  }

  static create(email: string): Email {
    const formattedEmail = this.format({
      propertyValue: email,
      isLowerCase: true,
    });

    const isValidEmail = this.emailAddressRegexTest(formattedEmail);

    if (!isValidEmail)
      throw new ValueObjectErrors.ValueObjectShouldBeValidValueObjectError({
        propertyName: "email",
      });

    const validatedEmail = this.valid({
      propertyValue: formattedEmail,
      propertyName: "email",
      lessThan: 255,
    });

    return new Email(validatedEmail);
  }
}
