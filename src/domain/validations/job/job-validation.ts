import { JobShouldBeLessThan255CharactersError } from "./errors/job-should-be-less-than-255-characters-error";
import { JobShouldBeThan5CharactersError } from "./errors/job-should-be-than-5-characters-error";
import { JobShouldNotBeEmptyError } from "./errors/job-should-not-be-empty-error";

export class JobValidation {
  public job: string;

  constructor(job: string) {
    this.job = job;
  }

  static validate(job: string): string {
    if (job.length === 0) throw new JobShouldNotBeEmptyError();
    if (job.length > 255) throw new JobShouldBeLessThan255CharactersError();
    if (job.length < 5) throw new JobShouldBeThan5CharactersError();

    return job;
  }
}
