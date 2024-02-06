import { ValueObjectBase } from "src/core/logic/domain/value-object/value-object-base";

export class Name extends ValueObjectBase {
  static create(name: string): Name {
    const formattedName = this.format({ propertyValue: name });

    const validatedName = this.valid({
      propertyValue: formattedName,
      propertyName: "name",
      lessThan: 255,
      greaterThan: 5,
    });

    return new Name(validatedName);
  }
}
