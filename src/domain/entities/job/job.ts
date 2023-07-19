import { JobValidation } from "@domain/validations/job/job-validation";

export class Job {
  public get value(): string {
    return this.job;
  }

  public set value(job: string) {
    this.job = job;
  }

  private constructor(private job: string) {}

  private static format(job: string): string {
    return job.trim().toLowerCase();
  }

  static create(job: string): Job {
    const formattedJob = this.format(job);

    const validatedJob = JobValidation.validate(formattedJob);

    return new Job(validatedJob);
  }
}
