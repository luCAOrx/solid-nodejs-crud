import { ok, strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

import { NameShouldBeLessThan255CharactersError } from "@domain/validations/name/errors/name-should-be-less-than-255-characters-error";
import { NameShouldBeThan5CharactersError } from "@domain/validations/name/errors/name-should-be-than-5-characters-error";
import { NameShouldNotBeEmptyError } from "@domain/validations/name/errors/name-should-not-be-empty-error";

import { Name } from "./name";

describe("Name value object", () => {
  it("should be able accept valid name", () => {
    const nameOrError = Name.create("Lucas");

    ok(nameOrError.value);
    strictEqual(nameOrError.value, "Lucas");
  });

  it("should be able reject name with empty content", () => {
    throws(() => Name.create(""), NameShouldNotBeEmptyError);
  });

  it("should be able reject name with more than 255 characters", () => {
    throws(
      () => Name.create("Lucas".repeat(260)),
      NameShouldBeLessThan255CharactersError
    );
  });

  it("should be able reject name with less than 5 characters", () => {
    throws(() => Name.create("Ana"), NameShouldBeThan5CharactersError);
  });
});
