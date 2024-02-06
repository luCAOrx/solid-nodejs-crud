import { ok, deepStrictEqual, throws } from "node:assert";
import { describe, it } from "node:test";
import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";

import { Name } from "./name";

describe("Name value object", () => {
  it("should be able accept valid name", () => {
    const nameOrError = Name.create("Lucas");

    ok(nameOrError.value);
    deepStrictEqual(nameOrError.value, "Lucas");
  });

  it("should be able reject name with empty content", () => {
    throws(
      () => Name.create(""),
      ValueObjectErrors.ValueObjectShouldNotBeEmptyError
    );
  });

  it("should be able reject name with more than 255 characters", () => {
    throws(
      () => Name.create("Lucas".repeat(260)),
      ValueObjectErrors.ValueObjectShouldBeLessThanError
    );
  });

  it("should be able reject name with less than 5 characters", () => {
    throws(
      () => Name.create("Ana"),
      ValueObjectErrors.ValueObjectShouldBeGreaterThanError
    );
  });
});
