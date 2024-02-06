import { ValueObjectBase } from "src/core/logic/domain/value-object/value-object-base";

export class Password extends ValueObjectBase {
  static create(password: string): Password {
    const validatedPassword = this.valid({
      propertyValue: password,
      propertyName: "password",
      lessThan: 255,
      greaterThan: 10,
    });

    return new Password(validatedPassword);
  }
}
