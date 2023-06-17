import { NameShouldBeLessThan255CharactersError } from "./errors/name-should-be-less-than-255-characters-error";
import { NameShouldBeThan5CharactersError } from "./errors/name-should-be-than-5-characters-error";
import { NameShouldNotBeEmptyError } from "./errors/name-should-not-be-empty-error";

export class NameValidation {
  private readonly name: string;

  public get value(): string {
    return this.name;
  }

  constructor(name: string) {
    this.name = name;
  }

  static valid(name: string): string {
    if (name.length === 0) throw new NameShouldNotBeEmptyError();
    if (name.length > 255) throw new NameShouldBeLessThan255CharactersError();
    if (name.length < 5) throw new NameShouldBeThan5CharactersError();

    return name;
  }
}
