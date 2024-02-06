import { ok, deepStrictEqual, throws } from "node:assert";
import { describe, it } from "node:test";
import { ValueObjectErrors } from "src/core/logic/domain/value-object/errors/value-object-errors";

import { Job } from "./job";

describe("Job value object", () => {
  it("should be accept valid job", () => {
    const jobOrError = Job.create("development");

    ok(jobOrError.value);
    deepStrictEqual(jobOrError.value, "development");
  });

  it("should be able reject job with empty content", () => {
    throws(
      () => Job.create(""),
      ValueObjectErrors.ValueObjectShouldNotBeEmptyError
    );
  });

  it("should be able reject job with more than 255 characters", () => {
    throws(
      () => Job.create("dev".repeat(260)),
      ValueObjectErrors.ValueObjectShouldBeLessThanError
    );
  });

  it("should be able reject job with less than 5 characters", () => {
    throws(
      () => Job.create("dev"),
      ValueObjectErrors.ValueObjectShouldBeGreaterThanError
    );
  });
});
