import { ok, strictEqual, throws } from "node:assert";
import { describe, it } from "node:test";

import { JobShouldBeLessThan255CharactersError } from "@domain/validations/job/errors/job-should-be-less-than-255-characters-error";
import { JobShouldBeThan5CharactersError } from "@domain/validations/job/errors/job-should-be-than-5-characters-error";
import { JobShouldNotBeEmptyError } from "@domain/validations/job/errors/job-should-not-be-empty-error";

import { Job } from "./job";

describe("Job value object", () => {
  it(" should be accept valid job", () => {
    const jobOrError = Job.create("development");

    ok(jobOrError.value);
    strictEqual(jobOrError.value, "development");
  });

  it("should be able reject job with empty content", () => {
    throws(() => Job.create(""), JobShouldNotBeEmptyError);
  });

  it("should be able reject job with more than 255 characters", () => {
    throws(
      () => Job.create("dev".repeat(260)),
      JobShouldBeLessThan255CharactersError
    );
  });

  it("should be able reject job with less than 5 characters", () => {
    throws(() => Job.create("dev"), JobShouldBeThan5CharactersError);
  });
});
