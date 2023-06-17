import { JobShouldBeLessThan255CharactersError } from "@domain/validations/job/errors/job-should-be-less-than-255-characters-error";
import { JobShouldBeThan5CharactersError } from "@domain/validations/job/errors/job-should-be-than-5-characters-error";
import { JobShouldNotBeEmptyError } from "@domain/validations/job/errors/job-should-not-be-empty-error";

import { Job } from "./job";

describe("Job value object", () => {
  it(" should be accept valid job", () => {
    const jobOrError = Job.create("development");

    expect(jobOrError.value).toBeTruthy();
    expect(jobOrError.value).toStrictEqual("development");
  });

  it("should be able reject job with empty content", () => {
    expect(() => Job.create("")).toThrowError(JobShouldNotBeEmptyError);
  });

  it("should be able reject job with more than 255 characters", () => {
    expect(() => Job.create("dev".repeat(260))).toThrowError(
      JobShouldBeLessThan255CharactersError
    );
  });

  it("should be able reject job with less than 5 characters", () => {
    expect(() => Job.create("dev")).toThrowError(
      JobShouldBeThan5CharactersError
    );
  });
});
