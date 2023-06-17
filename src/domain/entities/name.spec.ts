import { NameShouldBeLessThan255CharactersError } from "@domain/validations/name/errors/name-should-be-less-than-255-characters-error";
import { NameShouldBeThan5CharactersError } from "@domain/validations/name/errors/name-should-be-than-5-characters-error";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";

import { Name } from "./name";

describe("Name value object", () => {
  it("should be able accept valid name", () => {
    const nameOrError = Name.create("Lucas");

    expect(nameOrError.value).toBeTruthy();
    expect(nameOrError.value).toStrictEqual("Lucas");
  });

  it("should be able reject name with empty content", () => {
    expect(() => Name.create("")).toThrowError(NameShouldNotBeEmptyError);
  });

  it("should be able reject name with more than 255 characters", () => {
    expect(() => Name.create("Lucas".repeat(260))).toThrowError(
      NameShouldBeLessThan255CharactersError
    );
  });

  it("should be able reject name with less than 5 characters", () => {
    expect(() => Name.create("Ana")).toThrowError(
      NameShouldBeThan5CharactersError
    );
  });
});
