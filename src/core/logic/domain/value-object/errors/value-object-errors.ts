interface ValueObjectErrorsProps {
  propertyName: string;
  greaterThan?: number;
  lessThan?: number;
}

export namespace ValueObjectErrors {
  export class ValueObjectShouldNotBeEmptyError extends Error {
    constructor({ propertyName }: ValueObjectErrorsProps) {
      super(
        `[ValueObjectErrors]: The field ${propertyName} should not be empty`
      );

      this.message = `The field ${propertyName} should not be empty`;
    }
  }

  export class ValueObjectShouldBeValidValueObjectError extends Error {
    constructor({ propertyName }: ValueObjectErrorsProps) {
      super(
        `[ValueObjectErrors]: The field ${propertyName} should be valid ${propertyName}`
      );

      this.message = `The field ${propertyName} should be valid ${propertyName}`;
    }
  }

  export class ValueObjectShouldBeGreaterThanError extends Error {
    constructor({ propertyName, greaterThan }: ValueObjectErrorsProps) {
      super(
        `[ValueObjectErrors]: The field ${propertyName} should be greater than ${Number(
          greaterThan
        )} characters`
      );

      this.message = `The field ${propertyName} should be greater than ${Number(
        greaterThan
      )} characters`;
    }
  }

  export class ValueObjectShouldBeLessThanError extends Error {
    constructor({ propertyName, lessThan }: ValueObjectErrorsProps) {
      super(
        `[ValueObjectErrors]: The field ${propertyName} should be less than ${Number(
          lessThan
        )} characters`
      );

      this.message = `The field ${propertyName} should be less than ${Number(
        lessThan
      )} characters`;
    }
  }
}
