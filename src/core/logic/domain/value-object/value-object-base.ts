import { ValueObjectErrors } from "./errors/value-object-errors";

interface ValueObjectBaseProps {
  propertyValue: string;
  propertyName: string;
  greaterThan?: number;
  lessThan?: number;
}

interface FormatPropertyValueProps {
  propertyValue: string;
  isLowerCase?: boolean;
}

export abstract class ValueObjectBase {
  public get value(): string {
    return this.propertyValue;
  }

  public set value(propertyValue: string) {
    this.value = propertyValue;
  }

  constructor(private readonly propertyValue: string) {}

  static format({
    propertyValue,
    isLowerCase,
  }: FormatPropertyValueProps): string {
    if (isLowerCase === true) {
      return propertyValue.trim().toLowerCase();
    }

    return propertyValue.trim();
  }

  static valid({
    propertyValue,
    propertyName,
    greaterThan,
    lessThan,
  }: ValueObjectBaseProps): string {
    if (
      propertyValue.length === 0 ||
      propertyValue === null ||
      propertyValue === undefined
    )
      throw new ValueObjectErrors.ValueObjectShouldNotBeEmptyError({
        propertyName,
      });

    if (propertyValue.length > Number(lessThan))
      throw new ValueObjectErrors.ValueObjectShouldBeLessThanError({
        propertyName,
        lessThan,
      });

    if (propertyValue.length < Number(greaterThan))
      throw new ValueObjectErrors.ValueObjectShouldBeGreaterThanError({
        propertyName,
        greaterThan,
      });

    return propertyValue;
  }
}
