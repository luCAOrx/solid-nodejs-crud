import { NameValidation } from "@domain/validations/name/name-validation";

export class Name {
  public get value(): string {
    return this.name;
  }

  public set value(name: string) {
    this.name = name;
  }

  private constructor(private name: string) {}

  private static format(name: string): string {
    return name.trim();
  }

  static create(name: string): Name {
    const formattedName = this.format(name);

    const validatedName = NameValidation.valid(formattedName);

    return new Name(validatedName);
  }
}
