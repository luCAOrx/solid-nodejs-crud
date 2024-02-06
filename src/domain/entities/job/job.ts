import { ValueObjectBase } from "src/core/logic/domain/value-object/value-object-base";

export class Job extends ValueObjectBase {
  static create(job: string): Job {
    const formattedJob = this.format({ propertyValue: job, isLowerCase: true });

    const validatedJob = this.valid({
      propertyValue: formattedJob,
      propertyName: "job",
      lessThan: 255,
      greaterThan: 5,
    });

    return new Job(validatedJob);
  }
}
